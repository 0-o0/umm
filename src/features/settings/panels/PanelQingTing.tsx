import {
  Box,
  Code,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { fetchParakeet } from '@jixun/libparakeet';
import { ExtLink } from '~/components/ExtLink';
import { ChangeEvent, ClipboardEvent } from 'react';
import { VQuote } from '~/components/HelpText/VQuote';
import { selectStagingQtfmAndroidKey } from '../settingsSelector';
import { qtfmAndroidUpdateKey } from '../settingsSlice';

const QTFM_DEVICE_ID_URL = 'https://github.com/parakeet-rs/qtfm-device-id/releases/latest';

export function PanelQingTing() {
  const dispatch = useAppDispatch();
  const secretKey = useAppSelector(selectStagingQtfmAndroidKey);
  const setSecretKey = (secretKey: string) => {
    dispatch(qtfmAndroidUpdateKey({ deviceKey: secretKey }));
  };

  const handleDataPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const plainText = e.clipboardData.getData('text/plain');
    const matchDeviceSecret = plainText.match(/^DEVICE_SECRET: ([0-9a-fA-F]+)/m);
    if (matchDeviceSecret) {
      e.preventDefault();
      setSecretKey(matchDeviceSecret[1]);
      return;
    }

    const dataMap = new Map();
    for (const [_unused, key, value] of plainText.matchAll(
      /^(PRODUCT|DEVICE|MANUFACTURER|BRAND|BOARD|MODEL): (.+)/gim,
    )) {
      dataMap.set(key.toLowerCase(), value);
    }

    const product = dataMap.get('product') ?? null;
    const device = dataMap.get('device') ?? null;
    const manufacturer = dataMap.get('manufacturer') ?? null;
    const brand = dataMap.get('brand') ?? null;
    const board = dataMap.get('board') ?? null;
    const model = dataMap.get('model') ?? null;
    if (
      product !== null &&
      device !== null &&
      manufacturer !== null &&
      brand !== null &&
      board !== null &&
      model !== null
    ) {
      e.preventDefault();
      fetchParakeet().then((parakeet) => {
        setSecretKey(parakeet.qtfm.createDeviceKey(product, device, manufacturer, brand, board, model));
      });
    }
  };

  const handleDataInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSecretKey(e.target.value);
  };

  return (
    <Flex minH={0} flexDir="column" flex={1}>
      <Heading as="h2" size="lg">
        <VQuote>QingTing FM</VQuote>
        Device Key
      </Heading>

      <Text>
        The Android version of <VQuote>QingTing FM</VQuote> requires obtaining a device key to generate a decryption key.
      </Text>
      <Box mt={3} mb={3}>
        <FormControl>
          <FormLabel>Device Key</FormLabel>
          <Input type="text" onPaste={handleDataPaste} value={secretKey} onChange={handleDataInput} />
          <FormHelperText>
            {'When pasting content containing the device key (such as the device information obtained through '}
            <ExtLink href={QTFM_DEVICE_ID_URL}>
              <Code>qtfm-device-id</Code>
            </ExtLink>
            {'), the key will be automatically extracted.'}
          </FormHelperText>
        </FormControl>
      </Box>

      <Heading as="h3" size="md" pt={3} pb={2}>
        Notes
      </Heading>
      <UnorderedList>
        <ListItem>
          <Text>
            The downloaded files are located at
            <Code>[Internal Storage]/Android/data/fm.qingting.qtradio/files/Music/</Code>
          </Text>

          <UnorderedList>
            <ListItem>
              <Text>
                You may need to use a file browser with
                <ruby>
                  privileges
                  <rp> (</rp>
                  <rt>root</rt>
                  <rp>)</rp>
                </ruby>
                to access it.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          <Text>
            The audio files have the prefix "<Code>.p~!</Code>" in their filenames.
          </Text>
        </ListItem>
        <ListItem>
          <Text>Do not change the filename before decryption, as the decryption key is related to the filename.</Text>
        </ListItem>
      </UnorderedList>
    </Flex>
  );
}
