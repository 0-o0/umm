import { Code, ListItem, OrderedList, Text, chakra } from '@chakra-ui/react';

const KUWO_IOS_DIR = '/var/mobile/Containers/Data/Application/<Kuwo Data Directory>/mmkv';

export function InstructionsIOS() {
  return (
    <>
      <Text>You need to jailbreak to access the private data of iOS applications.</Text>
      <Text>
        ⚠️ Please note that jailbreaking usually means your device
        <chakra.span color="red.400">will lose warranty eligibility</chakra.span>.
      </Text>
      <OrderedList>
        <ListItem>
          <Text>
            Access this directory on your device:
            <Code wordBreak="break-word">{KUWO_IOS_DIR}</Code>
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            Extract the key database file <Code>kw_ekey</Code> to a directory accessible by the browser, such as the downloads directory.
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            Submit the extracted <Code>kw_ekey</Code> key database.
          </Text>
        </ListItem>
      </OrderedList>
    </>
  );
}
