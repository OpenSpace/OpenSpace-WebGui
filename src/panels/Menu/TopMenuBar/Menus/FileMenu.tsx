import { useTranslation } from 'react-i18next';
import { Anchor, Container, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { ChevronRightIcon, ConsoleIcon, ExitAppIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function FileMenu() {
  const profile = useAppSelector((state) => state.profile);
  const { t } = useTranslation(['menu', 'common'], { keyPrefix: 'file-menu' });
  const luaApi = useOpenSpaceApi();

  const [isConsoleVisible, setIsConsoleVisible] = useProperty(
    'BoolProperty',
    'LuaConsole.IsVisible'
  );

  function toggleLuaConsole() {
    setIsConsoleVisible(!isConsoleVisible);
  }

  function toggleShutdown() {
    return modals.openConfirmModal({
      title: t('quit.modal.title'),
      children: <Text>{t('quit.modal.body')}</Text>,
      labels: { confirm: t('quit.modal.confirm'), cancel: t('common:cancel') },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => luaApi?.toggleShutdown()
    });
  }

  return (
    <TopBarMenuWrapper targetTitle={t('title')} closeOnItemClick={false}>
      {!profile.initalized ? (
        <LoadingBlocks n={1} />
      ) : (
        <>
          <Menu.Label>
            {t('profile-label')}: {profile.name}
          </Menu.Label>
          <TopBarMenuWrapper
            targetTitle={
              <Menu.Item rightSection={<ChevronRightIcon size={IconSize.sm} />}>
                {t('about.title')}
              </Menu.Item>
            }
            position={'right-start'}
            withinPortal={false}
            closeOnItemClick={false}
          >
            <Container py={'xs'} px={'xs'} maw={300}>
              <Text>{profile.name}</Text>
              <Menu.Divider />
              {profile.description && (
                <Text size={'sm'} mb={'xs'}>
                  {profile.description}
                </Text>
              )}
              {profile.author && (
                <Text size={'sm'}>
                  {t('about.author')}: {profile.author}
                </Text>
              )}
              {profile.license && (
                <Text size={'sm'}>
                  {t('about.license')}: {profile.license}
                </Text>
              )}
              {profile.url && (
                <Text size={'sm'}>
                  {t('about.url')}:{' '}
                  <Anchor href={profile.url} target={'_blank'}>
                    {profile.url}
                  </Anchor>
                </Text>
              )}
              <Text size={'xs'} mt={'xs'} style={{ wordBreak: 'break-word' }}>
                {profile.filePath}
              </Text>
            </Container>
          </TopBarMenuWrapper>
        </>
      )}
      <Menu.Divider />
      <Menu.Item
        onClick={toggleLuaConsole}
        leftSection={<ConsoleIcon />}
        aria-checked={isConsoleVisible}
        aria-label={isConsoleVisible ? 'Close console' : 'Open console'}
      >
        {t('toggle-console')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        {t('quit.title')}
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
