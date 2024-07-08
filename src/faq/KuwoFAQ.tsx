import { Alert, AlertIcon, Container, Flex, List, ListItem, Text, chakra } from '@chakra-ui/react';
import { Header4 } from '~/components/HelpText/Header4';
import { VQuote } from '~/components/HelpText/VQuote';
import { SegmentTryOfficialPlayer } from './SegmentTryOfficialPlayer';
import { HiWord } from '~/components/HelpText/HiWord';
import { KWMv2AllInstructions } from '~/features/settings/panels/KWMv2/KWMv2AllInstructions';
import { SegmentKeyImportInstructions } from './SegmentKeyImportInstructions';

export function KuwoFAQ() {
  return (
    <>
      <Header4>Unlock Failure</Header4>
      <List spacing={2}>
        <ListItem>
          <SegmentTryOfficialPlayer />
        </ListItem>
        <ListItem>
          <Text>
            <chakra.strong>2. Check your platform</chakra.strong>
          </Text>
          <Text>
            Recently, only music files downloaded from the <HiWord>mobile client</HiWord> with
            <VQuote>
              <strong>HiFi 360-degree sound</strong>
            </VQuote>
            and
            <VQuote>
              <strong>HiFi Master</strong>
            </VQuote>
            {'audio quality adopt the new encryption.'}
          </Text>
          <Text>Other audio qualities currently do not require key extraction.</Text>
          <Text>The PC platform has not yet released audio quality using the new encryption.</Text>

          <Container p={2}>
            <Alert status="warning" borderRadius={5}>
              <AlertIcon />
              <Flex flexDir="column">
                <Text>Android users need root permission or file injection provider to extract the key.</Text>
                <Text>
                  <strong>Note</strong>: Some known modified versions may damage the key writing function, causing the key import to fail.
                </Text>
                <Text>
                  <strong>Note</strong>: The project team does not advocate the use of modified third-party applications and will not provide them. Please evaluate the risks before use.
                </Text>
              </Flex>
            </Alert>
          </Container>

          <SegmentKeyImportInstructions tab="KWMv2 Key" clientInstructions={<KWMv2AllInstructions />} />
        </ListItem>
      </List>
    </>
  );
}
