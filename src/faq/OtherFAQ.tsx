import { Alert, AlertIcon, Container, Flex, Img, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { ExtLink } from '~/components/ExtLink';
import { Header4 } from '~/components/HelpText/Header4';
import { VQuote } from '~/components/HelpText/VQuote';
import LdPlayerSettingsScreen from './assets/ld_settings_misc.webp';

export function OtherFAQ() {
  return (
    <>
      <Header4>No cover or other information after decryption</Header4>
      <Text>The project undergoes decryption. If the original resource does not have embedded metadata or cover, the decrypted file won't have them either.</Text>
      <Text>Please use third-party tools to edit or manage metadata.</Text>

      <Header4>Android: Browser support</Header4>
      <Text>⚠️ Limited support for mobile browsers. Please use the latest versions of Chrome or Firefox official browsers.</Text>
      <Text>Known problematic browsers:</Text>
      <UnorderedList>
        <ListItem>Via Browser</ListItem>
        <ListItem>Quark Browser</ListItem>
        <ListItem>UC Browser</ListItem>
      </UnorderedList>
      <Text>Possible issues you may encounter:</Text>
      <UnorderedList>
        <ListItem>Blank webpage</ListItem>
        <ListItem>Unable to download decrypted content</ListItem>
        <ListItem>Incorrect downloaded file name</ListItem>
      </UnorderedList>

      <Header4>Android: Root-related instructions</Header4>
      <Text>
        Obtaining root privileges on Android devices usually compromises system integrity and may result in the loss of warranty or the inability to use certain features such as NFC mobile payment.
      </Text>
      <Text>If you want to maintain system integrity, you can consider using an emulator.</Text>
      <Text>
        Currently, the common Android emulator solutions with root privilege support are LDPlayer (※ The official version has built-in ads) and Microsoft's Windows Subsystem for Android (WSA) supported in Windows 11.
        <ExtLink href="https://learn.microsoft.com/zh-cn/windows/android/wsa/">
          <ruby>
            Android™ for Windows Subsystem (WSA)
            <rp> (</rp>
            <rt>
              <code>Windows Subsystem for Android</code>
            </rt>
            <rp>)</rp>
          </ruby>
        </ExtLink>
        .
      </Text>

      <Container p={2}>
        <Alert status="warning" borderRadius={5}>
          <AlertIcon />
          <Flex flexDir="column">
            <Text>
              <strong>Note</strong>: Depending on the app vendor's risk control policy, accounts logged in using an emulator <strong>may be blocked</strong>; please assess the risk before using.
            </Text>
          </Flex>
        </Alert>
      </Container>

      <UnorderedList>
        <ListItem>
          <Text>
            {'For WSA, you can refer to the '}
            <ExtLink href="https://github.com/LSPosed/MagiskOnWSALocal">MagiskOnWSALocal</ExtLink>
            {' instructions for operation.'}
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            In LDPlayer, you can enable root privilege in <VQuote>Emulator Settings</VQuote> → <VQuote>Other Settings</VQuote>.
          </Text>
          <Img borderRadius={5} border="1px solid #ccc" src={LdPlayerSettingsScreen}></Img>
        </ListItem>
      </UnorderedList>

    </>
  );
}
