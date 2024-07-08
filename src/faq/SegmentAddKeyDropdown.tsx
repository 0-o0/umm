import { Flex, IconButton } from '@chakra-ui/react';
import { MdExpandMore } from 'react-icons/md';
import { HiWord } from '~/components/HelpText/HiWord';
import { VQuote } from '~/components/HelpText/VQuote';

export function SegmentAddKeyDropdown() {
  return (
    <Flex as="span" alignItems="center" flexWrap="wrap">
      Press the <VQuote>Add a key</VQuote> button
      on the <HiWord>right side</HiWord>
      <IconButton
        colorScheme="purple"
        variant="outline"
        size="sm"
        icon={<MdExpandMore />}
        ml="2"
        borderTopLeftRadius={0}
        borderBottomLeftRadius={0}
        pointerEvents="none"
        aria-label="Dropdown button"
      />
    </Flex>
  );
}
