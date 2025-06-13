import { useTranslation } from 'react-i18next';
import { Anchor, Grid, Image, Modal, Stack, Text, Title } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { SemanticVersion } from '@/types/types';

interface Props {
  opened: boolean;
  close: () => void;
}

export function About({ opened, close }: Props) {
  const openSpaceVersion = useAppSelector((state) => state.version.openSpaceVersion);
  const { t } = useTranslation('components', { keyPrefix: 'about' });

  function osVersionNumber(): string {
    if (!openSpaceVersion) {
      return t('fetching-version-number');
    }

    function formatVersion(version: SemanticVersion): string {
      return version.major !== 255 && version.minor !== 255 && version.patch !== 255
        ? `${version.major}.${version.minor}.${version.patch}`
        : t('custom-version-number');
    }

    return `OpenSpace version: ${formatVersion(openSpaceVersion)}`;
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t('modal-title')}
      size={'40%'}
      closeButtonProps={{ 'aria-label': 'Close about' }}
    >
      <Grid>
        <Grid.Col span={4}>
          <Image src={'/images/openspace-logo.png'} alt={t('logo-alt-text')} w={'100%'} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap={'xs'}>
            <Title order={1}>OpenSpace</Title>
            <Text>{t('about-openspace-description')}</Text>
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
