import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Heading,
  ListItem,
  OrderedList,
  Text,
  chakra,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljsStyleGitHub from 'react-syntax-highlighter/dist/esm/styles/hljs/github';

import PowerShellAdbDumpCommandTemplate from './adb_dump.ps1?raw';
import ShellAdbDumpCommandTemplate from './adb_dump.sh?raw';
import { ExtLink } from '../ExtLink';

const applyTemplate = (tpl: string, values: Record<string, unknown>) => {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => (Object.hasOwn(values, key) ? String(values[key]) : '<nil>'));
};

export interface AndroidADBPullInstructionProps {
  dir: string;
  file: string;
}

export function AndroidADBPullInstruction({ dir, file }: AndroidADBPullInstructionProps) {
  const psAdbDumpCommand = applyTemplate(PowerShellAdbDumpCommandTemplate, { dir, file });
  const shAdbDumpCommand = applyTemplate(ShellAdbDumpCommandTemplate, { dir, file });

  return (
    <>
      <Text>
        You need
        <ruby>
          superuser
          <rp> (</rp>
          <rt>
            <code>root</code>
          </rt>
          <rp>)</rp>
        </ruby>
        access to access private data of Android apps.
      </Text>
      <Text>
        ⚠️ Please note that gaining superuser access usually means your Android device
        <chakra.span color="red.400">will lose warranty eligibility</chakra.span>.
      </Text>

      <Accordion allowToggle mt="2">
        <AccordionItem>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Operations on Android Phone
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <OrderedList>
              <ListItem>
                <Text>
                  Launch a file browser with <Code>root</Code> privileges.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Access the <Code>{dir}/</Code> directory.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Copy the file <Code>{file}</Code> to a directory accessible by the browser.
                  <br />
                  (e.g., the Downloads directory)
                </Text>
              </ListItem>
              <ListItem>
                <Text>Submit the database file.</Text>
              </ListItem>
            </OrderedList>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Operations on PC (ADB / PowerShell)
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <OrderedList>
              <ListItem>
                <Text>
                  Make sure the <Code>adb</Code> command is available.
                </Text>
                <Text>
                  💡 If not, you can
                  <ExtLink href="https://scoop.sh/#/apps?q=adb">
                    install it using Scoop <ExternalLinkIcon />
                  </ExtLink>
                  .
                </Text>
              </ListItem>
              <ListItem>
                <Text>Launch a terminal and enter the PowerShell 7 environment.</Text>
              </ListItem>
              <ListItem>
                <Text>Connect the Android device to the computer and allow debugging.</Text>
              </ListItem>
              <ListItem>
                <Text>Paste and execute the following code. If the device prompts for "Superuser request," please allow it:</Text>
                <SyntaxHighlighter language="ps1" style={hljsStyleGitHub}>
                  {psAdbDumpCommand}
                </SyntaxHighlighter>
              </ListItem>
              <ListItem>
                <Text>
                  Submit the <Code>{file}</Code> file in the current directory.
                </Text>
              </ListItem>
            </OrderedList>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Operations on Linux / Mac (ADB / Shell)
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <OrderedList>
              <ListItem>
                <Text>
                  Make sure the <Code>adb</Code> command is available.
                </Text>
              </ListItem>
              <ListItem>
                <Text>Connect the Android device to the computer and allow debugging.</Text>
              </ListItem>
              <ListItem>
                <Text>Paste and execute the following code. If the device prompts for "Superuser request," please allow it:</Text>
                <SyntaxHighlighter language="bash" style={hljsStyleGitHub}>
                  {shAdbDumpCommand}
                </SyntaxHighlighter>
              </ListItem>
              <ListItem>
                <Text>
                  Submit the <Code>{file}</Code> file in the current directory.
                </Text>
              </ListItem>
            </OrderedList>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
