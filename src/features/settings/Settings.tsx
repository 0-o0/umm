import {
  chakra,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { PanelQMCv2Key } from './panels/PanelQMCv2Key';
import { useState } from 'react';
import { MdExpandMore, MdMenu, MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { commitStagingChange, discardStagingChanges } from './settingsSlice';
import { PanelKWMv2Key } from './panels/PanelKWMv2Key';
import { selectIsSettingsNotSaved } from './settingsSelector';
import { PanelQingTing } from './panels/PanelQingTing';

const TABS: { name: string; Tab: () => JSX.Element }[] = [
  { name: 'QMCv2 Key', Tab: PanelQMCv2Key },
  { name: 'KWMv2 Key', Tab: PanelKWMv2Key },
  { name: 'QingTing FM', Tab: PanelQingTing },
  {
    name: 'Other/Undecided',
    Tab: () => <Text>Empty here~</Text>,
  },
];

export function Settings() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const isLargeWidthDevice =
    useBreakpointValue({
      base: false,
      lg: true,
    }) ?? false;

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (idx: number) => {
    setTabIndex(idx);
  };
  const handleResetSettings = () => {
    dispatch(discardStagingChanges());

    toast({
      status: 'info',
      title: 'Unsaved settings discarded',
      description: 'Restored to the state before the changes.',
      isClosable: true,
    });
  };
  const handleApplySettings = () => {
    dispatch(commitStagingChange());
    toast({
      status: 'success',
      title: 'Settings applied',
      isClosable: true,
    });
  };
  const isSettingsNotSaved = useAppSelector(selectIsSettingsNotSaved);

  return (
    <Flex flexDir="column" flex={1}>
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<MdMenu />}
          rightIcon={<MdExpandMore />}
          colorScheme="gray"
          variant="outline"
          w="full"
          flexShrink={0}
          hidden={isLargeWidthDevice}
          mb="4"
        >
          {TABS[tabIndex].name}
        </MenuButton>
        <Portal>
          <MenuList w="100px">
            {TABS.map(({ name }, i) => (
              <MenuItem key={name} onClick={() => setTabIndex(i)}>
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Portal>
      </Menu>

      <Tabs
        orientation={isLargeWidthDevice ? 'vertical' : 'horizontal'}
        align="start"
        variant="line-i"
        display="flex"
        flex={1}
        index={tabIndex}
        onChange={handleTabChange}
      >
        <TabList hidden={!isLargeWidthDevice} minW="8em" width="8em" textAlign="right" justifyContent="center">
          {TABS.map(({ name }) => (
            <Tab key={name}>{name}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {TABS.map(({ name, Tab }) => (
            <Flex as={TabPanel} flex={1} flexDir="column" h="100%" key={name}>
              <Flex h="100%" flex={1} minH={0}>
                <Tab />
              </Flex>

              <VStack mt="4" alignItems="flex-start" w="full">
                <Flex flexDir="row" gap="2" w="full">
                  <Center>
                    {isSettingsNotSaved ? (
                      <Box color="gray">
                        Unsaved changes{' '}
                        <chakra.span color="red" wordBreak="keep-all">
                          Settings will take effect after saving
                        </chakra.span>
                      </Box>
                    ) : (
                      <Box color="gray">Settings will take effect after saving</Box>
                    )}
                  </Center>
                  <Spacer />
                  <HStack gap="2" justifyContent="flex-end">
                    <IconButton
                      icon={<Icon as={MdOutlineSettingsBackupRestore} />}
                      onClick={handleResetSettings}
                      colorScheme="red"
                      variant="ghost"
                      title="Discard unsaved changes and restore settings to the state before the changes."
                      aria-label="Discard unsaved changes"
                    />
                    <Button onClick={handleApplySettings}>Save</Button>
                  </HStack>
                </Flex>
              </VStack>
            </Flex>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
