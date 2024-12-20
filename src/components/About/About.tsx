import { Anchor, Grid, Image, Modal, Stack, Text, Title } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { SemanticVersion } from '@/types/types';

interface Props {
  opened: boolean;
  close: () => void;
}

export function About({ opened, close }: Props) {
  const openSpaceVersion = useAppSelector((state) => state.version.openSpaceVersion);

  function osVersionNumber(): string {
    if (!openSpaceVersion) {
      return 'Fetching OpenSpace version...';
    }

    function formatVersion(version: SemanticVersion): string {
      return version.major !== 255 && version.minor !== 255 && version.patch !== 255
        ? `${version.major}.${version.minor}.${version.patch}`
        : 'Custom';
    }

    return `OpenSpace version: ${formatVersion(openSpaceVersion)}`;
  }

  return (
    <Modal opened={opened} onClose={close} title={'About OpenSpace'} size={'40%'}>
      <Grid>
        <Grid.Col span={4}>
          <Image src={'openspace-logo.png'} alt={'OpenSpace logo'} w={'100%'} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap={'xs'}>
            <Title order={1}>OpenSpace</Title>
            <Text>
              OpenSpace is open-source interactive data visualization software designed to
              visualize the entire known universe and portray our ongoing efforts to
              investigate the cosmos.
            </Text>
            <Text>{osVersionNumber()}</Text>
            <Text>
              &copy; 2014 - {new Date().getFullYear()} OpenSpace Development Team
            </Text>
            <Anchor href={'https://www.openspaceproject.com/'} target={'_blank'}>
              openspaceproject.com
            </Anchor>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
