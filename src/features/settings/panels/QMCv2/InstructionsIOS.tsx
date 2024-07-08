import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import { InstructionsIOSCondition } from './InstructionsIOSCondition';

export function InstructionsIOS() {
  return (
    <>
      <Box>
        <Text>It is quite troublesome to access the private files of iOS devices. You need to jailbreak or use a PC or Mac to perform a complete backup of the iOS device.</Text>
        <Text>Therefore, it is recommended to switch to a PC or Mac, re-download the music files, and then try to decrypt them.</Text>
      </Box>
      <Accordion allowToggle mt="2">
        <AccordionItem>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                My iOS device is already jailbroken
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <InstructionsIOSCondition jailbreak={true} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                My iOS device is not jailbroken
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <InstructionsIOSCondition jailbreak={false} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
