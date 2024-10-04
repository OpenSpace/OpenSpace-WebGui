import { IoInformationCircleOutline } from 'react-icons/io5';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Select,
  Stack,
  TextInput,
  ThemeIcon,
  Tooltip
} from '@mantine/core';

export function SessionRec() {
  return (
    <Container>
      <h2>Record Session</h2>
      <Checkbox label="Text file format" mb={'sm'}></Checkbox>
      <Group>
        <TextInput placeholder="Enter recording filename"></TextInput>
        <Button>Record</Button>
      </Group>
      <Divider my="xs"></Divider>
      <h2 style={{ marginTop: 0 }}>Play Session</h2>
      <Stack gap={'xs'}>
        <Checkbox label="Force time change to recorded time" />
        <Checkbox label={'Loop playback'} />
        <Group>
          <Checkbox label={'Output frames'} />
          <Tooltip
            label={`If checked, the specified number of frames will be recorded as
                screenshots and saved to disk. Per default, they are saved in the
                user/screenshots folder. This feature can not be used together with
                'loop playback'`}
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 400 }}
            offset={{ mainAxis: 5, crossAxis: 100 }}
          >
            <ThemeIcon radius={'xl'} size={'sm'}>
              <IoInformationCircleOutline style={{ width: '80%', height: '80%' }} />
            </ThemeIcon>
          </Tooltip>
        </Group>
      </Stack>
      <Group gap={'xs'} align={'flex-end'}>
        <Select
          label={'Playback file'}
          placeholder="Select file"
          data={[
            'file1.osrec',
            'file2.osrec',
            'file3.json',
            'file4.osrec',
            'longfilename.osrec',
            'evenlongerfilename.osrec'
          ]}
        />
        <Button>Play</Button>
      </Group>
    </Container>
  );
}
