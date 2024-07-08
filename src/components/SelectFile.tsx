import { Box, Text } from '@chakra-ui/react';
import { UnlockIcon } from '@chakra-ui/icons';

import { useAppDispatch } from '~/hooks';
import { addNewFile, processFile } from '~/features/file-listing/fileListingSlice';
import { nanoid } from 'nanoid';
import { FileInput } from './FileInput';

export function SelectFile() {
  const dispatch = useAppDispatch();
  const handleFileReceived = (files: File[]) => {
    console.debug(
      'react-dropzone/onDropAccepted(%o, %o)',
      files.length,
      files.map((x) => x.name)
    );

    for (const file of files) {
      const blobURI = URL.createObjectURL(file);
      const fileName = file.name;
      const fileId = 'file://' + nanoid();

      // FIXME: this should be a single action/thunk that first adds the item, then updates it.
      dispatch(
        addNewFile({
          id: fileId,
          blobURI,
          fileName,
        })
      );
      dispatch(processFile({ fileId }));
    }
  };

  return (
    <FileInput multiple onReceiveFiles={handleFileReceived}>
      <Box pb={3}>
        <UnlockIcon boxSize={8} />
      </Box>
      <Text as="div" textAlign="center">
        Drag or{' '}
        <Text as="span" color="teal.400">
          click
        </Text>{' '}
        and select files be decrypted{' '}
        <Text fontSize="sm" opacity="50%">
          Decrypt files in the browser without uploading them
        </Text>
      </Text>
    </FileInput>
  );
}
