import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Avatar,
  Box,
  Code,
  Container,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { SemanticVersion } from 'openspace-api-js/types';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import { ThirdPartyDependencies } from '@/data/ThirdPartyDependencies';
import { getContributors } from '@/redux/contributors/contributorsMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

interface Props {
  opened: boolean;
  close: () => void;
}

export function About({ opened, close }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'about' });

  const dispatch = useAppDispatch();
  const openSpaceVersion = useAppSelector((state) => state.version.openSpaceVersion);
  const contributors = useAppSelector((state) => state.contributors.contributors);
  const contributorsStatus = useAppSelector((state) => state.contributors.status);

  useEffect(() => {
    if (opened && (contributorsStatus === 'idle' || contributorsStatus === 'failed')) {
      dispatch(getContributors());
    }
  }, [opened, contributorsStatus, dispatch]);

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
      size={'xxl'}
      closeButtonProps={{ 'aria-label': 'Close about' }}
      scrollAreaComponent={Modal.NativeScrollArea}
    >
      <Container px={'xs'}>
        <Group wrap={'nowrap'} align={'top'}>
          <Box px={'xs'}>
            <Image
              src={`${import.meta.env.BASE_URL}/images/openspace-logo.png`}
              alt={t('logo-alt-text')}
              w={{ xs: 100, sm: 180 }}
              fit={'contain'}
            />
          </Box>
          <Stack gap={'xs'}>
            <Title order={1}>OpenSpace</Title>
            <Text>{t('about-openspace-description')}</Text>
            <Text>{osVersionNumber()}</Text>
            <Text>
              &copy; 2014 - {new Date().getFullYear()} OpenSpace Development Team
            </Text>
            <Anchor
              href={'https://www.openspaceproject.com/'}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              openspaceproject.com
            </Anchor>
            <Text>{t('openspace-institutions')}</Text>
          </Stack>
        </Group>

        <Title order={3}>{t('contributors-title')}</Title>
        <div style={{ marginTop: 'var(--mantine-spacing-xs)' }}>
          {contributorsStatus === 'loading' && (
            <Text c={'dimmed'}>{t('contributors-loading')}</Text>
          )}
          {contributorsStatus === 'failed' && (
            <Text c={'red'}>{t('contributors-error')}</Text>
          )}
          {contributorsStatus === 'succeeded' && (
            <SimpleGrid cols={{ base: 6, xs: 10, sm: 12, md: 14 }} spacing={'xs'}>
              {contributors.map((contributor) => (
                <Anchor
                  key={contributor.login}
                  href={contributor.htmlUrl}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  underline={'never'}
                  c={'inherit'}
                >
                  <Stack align={'center'} gap={4}>
                    <Avatar
                      src={contributor.avatarUrl}
                      alt={contributor.login}
                      size={'md'}
                    />
                    <Text size={'xs'} ta={'center'} style={{ wordBreak: 'break-all' }}>
                      {contributor.login}
                    </Text>
                  </Stack>
                </Anchor>
              ))}
            </SimpleGrid>
          )}
        </div>

        <Title order={3} mt={'md'} mb={'xs'}>
          {t('third-party-title')}
        </Title>
        <Stack gap={0}>
          {ThirdPartyDependencies.map((dep) => (
            <Collapsable key={dep.name} title={dep.name} noTransition>
              <Stack gap={'xs'} pb={'xs'}>
                <Text size={'sm'}>
                  <Text span fw={600}>
                    {t('third-party-license-label')}:{' '}
                  </Text>
                  {dep.license}
                </Text>
                <Text size={'sm'}>
                  <Text span fw={600}>
                    {t('third-party-url-label')}:{' '}
                  </Text>
                  <Anchor
                    href={dep.url}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    size={'sm'}
                  >
                    {dep.url}
                  </Anchor>
                </Text>
                <Code
                  block
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: 'var(--mantine-font-size-xs)'
                  }}
                >
                  {dep.licenseText}
                </Code>
              </Stack>
            </Collapsable>
          ))}
        </Stack>
      </Container>
    </Modal>
  );
}
