import {
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { FileInput } from '~/components/FileInput';

export interface ImportSecretModalProps {
  clientName?: React.ReactNode;
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export function ImportSecretModal({ clientName, children, show, onClose, onImport }: ImportSecretModalProps) {
  const handleFileReceived = (files: File[]) => onImport(files[0]);

  return (
    <Modal isOpen={show} onClose={onClose} closeOnOverlayClick={false} scrollBehavior="inside" size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Secret from File</ModalHeader>
        <ModalCloseButton />
        <Flex as={ModalBody} gap={2} flexDir="column" flex={1}>
          <Center>
            <FileInput onReceiveFiles={handleFileReceived}>Drag and drop or click to select the database file containing the secret</FileInput>
          </Center>

          <Text as="div" mt={2}>
            Select your {clientName && <>"{clientName}"</>} client platform to view the corresponding instructions:
          </Text>
          <Flex as={Tabs} variant="enclosed" flexDir="column" flex={1} minH={0}>
            {children}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
