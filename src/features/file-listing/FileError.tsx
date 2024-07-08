import { chakra, Box, Button, Collapse, Text, useDisclosure } from '@chakra-ui/react';
import { DecryptErrorType } from '~/decrypt-worker/util/DecryptError';

export interface FileErrorProps {
  error: null | string;
  code: null | string;
}

const errorMap = new Map<string | null | DecryptErrorType, string>([
  [DecryptErrorType.UNSUPPORTED_FILE, 'Unsupported file format'],
]);

export function FileError({ error, code }: FileErrorProps) {
  const { isOpen, onToggle } = useDisclosure();
  const errorSummary = errorMap.get(code) ?? 'Unknown error';

  return (
    <Box>
      <Text>
        <chakra.span>
          Decryption error: <chakra.span color="red.700">{errorSummary}</chakra.span>
        </chakra.span>
        {error && (
          <Button ml="2" onClick={onToggle} type="button">
            Details
          </Button>
        )}
      </Text>
      {error && (
        <Collapse in={isOpen} animateOpacity>
          <Box as="pre" display="inline-block" mt="2" px="4" py="2" bg="red.100" color="red.800" rounded="md">
            {error}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
