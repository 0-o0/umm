import { Alert, AlertIcon, Container, Flex, List, ListItem, Text, UnorderedList, chakra } from '@chakra-ui/react';
import { Header4 } from '~/components/HelpText/Header4';
import { SegmentTryOfficialPlayer } from './SegmentTryOfficialPlayer';
import { QMCv2QQMusicAllInstructions } from '~/features/settings/panels/QMCv2/QMCv2QQMusicAllInstructions';
import { SegmentKeyImportInstructions } from './SegmentKeyImportInstructions';
import { ExtLink } from '~/components/ExtLink';

export function QQMusicFAQ() {
  return (
    <>
      <Header4>Unlock Failed</Header4>
      <List spacing={2}>
        <ListItem>
          <SegmentTryOfficialPlayer />
        </ListItem>
        <ListItem>
          <Text>
            <chakra.strong>2. Check Your Platform</chakra.strong>
          </Text>
          <Text>
            Recently, song files downloaded with Windows client version 19.43 or lower do not require a key. Official official versions on other platforms require key extraction.
            You can get the installation program for QQ Music Windows client v19.43 from the link below:
          </Text>
          <UnorderedList pl={3}>
            <ListItem>
              <Text>
                <ExtLink href="https://dldir1v6.qq.com/music/clntupate/QQMusic_Setup_1943.exe">
                  <code>qq.com</code> Official Download Link (Recommended)
                </ExtLink>
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                <ExtLink href="https://web.archive.org/web/2023/https://dldir1v6.qq.com/music/clntupate/QQMusic_Setup_1943.exe">
                  <code>Archive.org</code> Archive
                </ExtLink>
              </Text>
            </ListItem>
          </UnorderedList>

          <Container p={2}>
            <Alert status="warning" borderRadius={5}>
              <AlertIcon />
              <Flex flexDir="column">
                <Text>iOS users may have difficulty extracting songs and are advised to use a computer;</Text>
                <Text>Android users need root access to extract keys and are also advised to use a computer.</Text>
              </Flex>
            </Alert>
          </Container>

          <Container p={2} pt={0}>
            <Alert status="info" borderRadius={5}>
              <AlertIcon />
              Downloading the same song multiple times does not deduct download quota, but downloading different versions of the same song will deduct download quota, so please distinguish carefully.
            </Alert>
          </Container>

          <SegmentKeyImportInstructions tab="QMCv2 Key" clientInstructions={<QMCv2QQMusicAllInstructions />} />
        </ListItem>
      </List>
    </>
  );
}
