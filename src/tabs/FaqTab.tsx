import { Center, Container, Heading } from '@chakra-ui/react';
import { Header3 } from '~/components/HelpText/Header3';
import { KuwoFAQ } from '~/faq/KuwoFAQ';
import { OtherFAQ } from '~/faq/OtherFAQ';
import { QQMusicFAQ } from '~/faq/QQMusicFAQ';

export function FaqTab() {
  return (
    <Container pb={10} maxW="container.md">
      <Center>
        <Heading as="h2">Frequently Asked Questions</Heading>
      </Center>
      <Header3>QQ Music</Header3>
      <QQMusicFAQ />
      <Header3>Kuwo Music</Header3>
      <KuwoFAQ />
      <Header3>Other Questions</Header3>
      <OtherFAQ />
    </Container>
  );
}
