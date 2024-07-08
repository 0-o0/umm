import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
  Select,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { qmc2AddKey, qmc2AllowFuzzyNameSearch, qmc2ClearKeys, qmc2ImportKeys } from '../settingsSlice';
import { selectStagingQMCv2Settings } from '../settingsSelector';
import React, { useState } from 'react';
import { MdAdd, MdDeleteForever, MdExpandMore, MdFileUpload } from 'react-icons/md';
import { QMCv2EKeyItem } from './QMCv2/QMCv2EKeyItem';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { ImportSecretModal } from '~/components/ImportSecretModal';
import { StagingQMCv2Key } from '../keyFormats';
import { DatabaseKeyExtractor } from '~/util/DatabaseKeyExtractor';
import { parseAndroidQmEKey } from '~/util/mmkv/qm';
import { getFileName } from '~/util/pathHelper';
import { QMCv2QQMusicAllInstructions } from './QMCv2/QMCv2QQMusicAllInstructions';
import { QMCv2DoubanAllInstructions } from './QMCv2/QMCv2DoubanAllInstructions';

export function PanelQMCv2Key() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { keys: qmc2Keys, allowFuzzyNameSearch } = useSelector(selectStagingQMCv2Settings);
  const [showImportModal, setShowImportModal] = useState(false);
  const [secretType, setSecretType] = useState<'qm' | 'douban'>('qm');

  const addKey = () => dispatch(qmc2AddKey());
  const clearAll = () => dispatch(qmc2ClearKeys());

  const handleAllowFuzzyNameSearchCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(qmc2AllowFuzzyNameSearch({ enable: e.target.checked }));
  };

  const handleSecretImport = async (file: File) => {
    try {
      const fileBuffer = await file.arrayBuffer();

      let qmc2Keys: null | Omit<StagingQMCv2Key, 'id'>[] = null;

      if (/(player_process[_.]db|music_audio_play)(\.db)?$/i.test(file.name)) {
        const extractor = await DatabaseKeyExtractor.getInstance();
        qmc2Keys = extractor.extractQmcV2KeysFromSqliteDb(fileBuffer);
        if (!qmc2Keys) {
          alert(`Not a supported SQLite database file.`);
          return;
        }
      } else if (/MMKVStreamEncryptId|filenameEkeyMap|qmpc-mmkv-v1/i.test(file.name)) {
        const fileBuffer = await file.arrayBuffer();
        const map = parseAndroidQmEKey(new DataView(fileBuffer));
        qmc2Keys = Array.from(map.entries(), ([name, ekey]) => ({ name: getFileName(name), ekey }));
      }

      if (qmc2Keys?.length === 0) {
        toast({
          title: 'No keys imported',
          description: 'No usable keys found in the selected key database file.',
          isClosable: true,
          status: 'warning',
        });
      } else if (qmc2Keys) {
        dispatch(qmc2ImportKeys(qmc2Keys));
        setShowImportModal(false);
        toast({
          title: `Import successful (${qmc2Keys.length})`,
          description: 'Remember to save the changes to apply them.',
          isClosable: true,
          status: 'success',
        });
      } else {
        alert(`Unsupported file: ${file.name}`);
      }
    } catch (e) {
      console.error('error during import: ', e);
      alert(`Error occurred during database import: ${e}`);
    }
  };

  return (
    <Flex minH={0} flexDir="column" flex={1}>
      <Heading as="h2" size="lg">
        QMCv2 Decryption Keys
      </Heading>

      <Text>
        QQ Music and Douban FM currently use the encryption scheme QMCv2. The "offline encryption file" corresponding to
        QQ Music Android, Mac, or iOS clients, as well as Douban FM Android clients, stores the "key" in a separate
        database file.
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

        <HStack>
          <Checkbox isChecked={allowFuzzyNameSearch} onChange={handleAllowFuzzyNameSearchCheckbox}>
            <Text>Match similar file names</Text>
          </Checkbox>
          <Tooltip
            hasArrow
            closeOnClick={false}
            label={
              <Box>
                <Text>If the file name matching fails, use the key of a similar file name.</Text>
                <Text>
                  Calculate the similarity using the "Levenshtein distance" algorithm.
                </Text>
                <Text>If there are too many keys, matching may cause the browser to freeze or become unresponsive for a while.</Text>
                <Text>If unsure, please check this option.</Text>
              </Box>
            }
          >
            <InfoOutlineIcon />
          </Tooltip>
        </HStack>
      </HStack>

      <Box flex={1} minH={0} overflow="auto" pr="4">
        <List spacing={3}>
          {qmc2Keys.map(({ id, ekey, name }, i) => (
            <QMCv2EKeyItem key={id} id={id} ekey={ekey} name={name} i={i} />
          ))}
        </List>
        {qmc2Keys.length === 0 && <Text>No keys yet.</Text>}
      </Box>

      <ImportSecretModal
        clientName={
          <Select
            value={secretType}
            onChange={(e) => setSecretType(e.target.value as 'qm' | 'douban')}
            variant="flushed"
            display="inline"
            css={{ paddingLeft: '0.75rem', width: 'auto' }}
          >
            <option value="qm">QQ Music</option>
            <option value="douban">Douban FM</option>
          </Select>
        }
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleSecretImport}
      >
        {secretType === 'qm' && <QMCv2QQMusicAllInstructions />}
        {secretType === 'douban' && <QMCv2DoubanAllInstructions />}
      </ImportSecretModal>
    </Flex>
  );
}
