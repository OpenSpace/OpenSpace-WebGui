import { Anchor, CheckboxIndicator, Container, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { ChevronRightIcon, ConsoleIcon, ExitAppIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';
import { IconSize } from '@/types/enums';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';
import { useTranslation } from 'react-i18next';

export function FileMenu() {
  const profile = useAppSelector((state) => state.profile);

  const luaApi = useOpenSpaceApi();

  const [isConsoleVisible, setIsConsoleVisible] = useProperty(
    'BoolProperty',
    'LuaConsole.IsVisible'
  );
  const { t } = useTranslation('menu', { keyPrefix: 'file-menu' });

  function toggleLuaConsole() {
    setIsConsoleVisible(!isConsoleVisible);
  }

  function toggleShutdown() {
    return modals.openConfirmModal({
      title: t('quit-openspace.modal.title'),
      children: <Text>{t('quit-openspace.modal.description')}</Text>,
      labels: {
        confirm: t('quit-openspace.modal.confirm'),
        cancel: t('quit-openspace.modal.cancel')
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => luaApi?.toggleShutdown()
    });
  }

  return (
    <TopBarMenuWrapper targetTitle={'File'} closeOnItemClick={false}>
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
                {t('about.label')}
              </Menu.Item>
            }
            position={'right-start'}
            withinPortal={false}
            closeOnItemClick={false}
          >
            <Container py={'xs'} px={'xs'} maw={300}>
              <Text className={styles.selectable}>{profile.name}</Text>
              <Menu.Divider />
              {profile.description && (
                <Text size={'sm'} mb={'xs'} className={styles.selectable}>
                  {profile.description}
                </Text>
              )}
              {profile.author && (
                <Text size={'sm'} className={styles.selectable}>
                  {t('about.author')}: {profile.author}
                </Text>
              )}
              {profile.license && (
                <Text size={'sm'} className={styles.selectable}>
                  {t('about.license')}: {profile.license}
                </Text>
              )}
              {profile.url && (
                <Text size={'sm'} className={styles.selectable}>
                  {t('about.url')}:{' '}
                  <Anchor
                    href={profile.url}
                    target={'_blank'}
                    className={styles.selectable}
                  >
                    {profile.url}
                  </Anchor>
                </Text>
              )}
              <Text
                size={'xs'}
                mt={'xs'}
                style={{ wordBreak: 'break-word' }}
                className={styles.selectable}
              >
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
        rightSection={
          <CheckboxIndicator
            checked={isConsoleVisible}
            aria-label={
              isConsoleVisible
                ? t('toggle-console.aria-labels.checked')
                : t('toggle-console.aria-labels.unchecked')
            }
          />
        }
        aria-label={
          isConsoleVisible
            ? t('toggle-console.aria-labels.close-console')
            : t('toggle-console.aria-labels.open-console')
        }
      >
        {t('toggle-console.label')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        {t('quit-openspace.label')}
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
