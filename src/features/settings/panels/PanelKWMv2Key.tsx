import {
  Box,
  Button,
  ButtonGroup,
  Code,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  List,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAdd, MdDeleteForever, MdExpandMore, MdFileUpload } from 'react-icons/md';

import { ImportSecretModal } from '~/components/ImportSecretModal';
import { parseAndroidKuwoEKey, parseIosKuwoEKey } from '~/util/mmkv/kuwo';

import { kwm2AddKey, kwm2ClearKeys, kwm2ImportKeys } from '../settingsSlice';
import { selectStagingKWMv2Keys } from '../settingsSelector';
import { KWMv2EKeyItem } from './KWMv2/KWMv2EKeyItem';
import type { StagingKWMv2Key } from '../keyFormats';
import { KWMv2AllInstructions } from './KWMv2/KWMv2AllInstructions';

export function PanelKWMv2Key() {
  const toast = useToast();
  const dispatch = useDispatch();
  const kwm2Keys = useSelector(selectStagingKWMv2Keys);
  const [showImportModal, setShowImportModal] = useState(false);

  const addKey = () => dispatch(kwm2AddKey());
  const clearAll = () => dispatch(kwm2ClearKeys());
  const handleSecretImport = async (file: File) => {
    let keys: Omit<StagingKWMv2Key, 'id'>[] | null = null;
    if (/cn\.kuwo\.player\.mmkv/i.test(file.name)) {
      keys = parseAndroidKuwoEKey(new DataView(await file.arrayBuffer()));
    } else if (/kw_ekey/.test(file.name)) {
      keys = parseIosKuwoEKey(new DataView(await file.arrayBuffer()));
    }

    if (keys?.length === 0) {
      toast({
        title: 'No keys imported',
        description: 'The selected key database file does not contain any usable keys.',
        isClosable: true,
        status: 'warning',
      });
    } else if (keys) {
      dispatch(kwm2ImportKeys(keys));
      setShowImportModal(false);
      toast({
        title: `Import completed, ${keys.length} keys imported.`,
        description: 'Remember to press "Save" to apply the changes.',
        isClosable: true,
        status: 'success',
      });
    } else {
      toast({
        title: `Unsupported file: ${file.name}`,
        isClosable: true,
        status: 'error',
      });
    }
  };

  return (
    <Flex minH={0} flexDir="column" flex={1}>
      <Heading as="h2" size="lg">
        Kuwo Decryption Keys (KwmV2)
      </Heading>

      <Text>
        The "Premium Sound Quality" feature in the Kuwo Android version has switched to V2 format, with the file extension <Code>mflac</Code> or the old <Code>kwm</Code>.{''}
        To decrypt the files in this format, the keys need to be extracted.
      </Text>

      <HStack pb={2} pt={2}>
        <ButtonGroup isAttached colorScheme="purple" variant="outline">
          <Button onClick={addKey} leftIcon={<Icon as={MdAdd} />}>
            Add a key
          </Button>
          <Menu>
            <MenuButton as={IconButton} icon={<MdExpandMore />}></MenuButton>
            <MenuList>
              <MenuItem onClick={() => setShowImportModal(true)} icon={<Icon as={MdFileUpload} boxSize={5} />}>
                Import keys from file...
              </MenuItem>
              <MenuDivider />
              <MenuItem color="red" onClick={clearAll} icon={<Icon as={MdDeleteForever} boxSize={5} />}>
                Clear keys
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </HStack>

      <Box flex={1} minH={0} overflow="auto" pr="4">
        <List spacing={3}>
          {kwm2Keys.map(({ id, ekey, quality, rid }, i) => (
            <KWMv2EKeyItem key={id} id={id} ekey={ekey} quality={quality} rid={rid} i={i} />
          ))}
        </List>
        {kwm2Keys.length === 0 && <Text>No keys added yet.</Text>}
      </Box>

      <ImportSecretModal
        clientName="Kuwo Music"
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleSecretImport}
      >
        <KWMv2AllInstructions />
      </ImportSecretModal>
    </Flex>
  );
}
