import { Flex, Icon, ListItem, OrderedList, Tabs, Text } from '@chakra-ui/react';
import { SegmentTopNavSettings } from './SegmentTopNavSettings';
import { VQuote } from '~/components/HelpText/VQuote';
import { SegmentAddKeyDropdown } from './SegmentAddKeyDropdown';
import React from 'react';
import { MdFileUpload } from 'react-icons/md';

export interface SegmentKeyImportInstructionsProps {
  clientInstructions: React.ReactNode;
  tab: string;
}

export function SegmentKeyImportInstructions({ clientInstructions, tab }: SegmentKeyImportInstructionsProps) {
  return (
    <>
      <Text>Importing a key can be done by following these steps:</Text>
      <OrderedList>
        <ListItem>
          <SegmentTopNavSettings />
        </ListItem>
        <ListItem>
          Set the region to <VQuote>{tab}</VQuote>
        </ListItem>
        <ListItem>
          <SegmentAddKeyDropdown />
        </ListItem>
        <ListItem>
          <Flex flexDir="row" alignItems="center">
            {'Select '}
            <VQuote>
              <Icon as={MdFileUpload} boxSize={5} mr={2} /> Import key from file...
            </VQuote>
          </Flex>
        </ListItem>
        <ListItem>
          <Text>Select your client platform to view key extraction instructions:</Text>
          <Tabs display="flex" flexDir="column" border="1px solid" borderColor="gray.300" borderRadius={5}>
            {clientInstructions}
          </Tabs>
        </ListItem>
      </OrderedList>
    </>
  );
}
