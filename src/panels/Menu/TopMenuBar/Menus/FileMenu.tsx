import { Anchor, CheckboxIndicator, Container, Menu, Text } from '@mantine/core';
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
      title: 'Confirm action',
      children: <Text>Are you sure you want to quit OpenSpace?</Text>,
      labels: { confirm: 'Quit', cancel: 'Cancel' },
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
          <Menu.Label>Profile: {profile.name}</Menu.Label>
          <TopBarMenuWrapper
            targetTitle={
              <Menu.Item rightSection={<ChevronRightIcon size={IconSize.sm} />}>
                About
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
              {profile.author && <Text size={'sm'}>Author: {profile.author}</Text>}
              {profile.license && <Text size={'sm'}>License: {profile.license}</Text>}
              {profile.url && (
                <Text size={'sm'}>
                  URL:{' '}
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
        rightSection={
          <CheckboxIndicator
            checked={isConsoleVisible}
            aria-label={isConsoleVisible ? 'Checked' : 'Unchecked'}
          />
        }
        aria-label={isConsoleVisible ? 'Close console' : 'Open console'}
      >
        Show Console
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        Quit OpenSpace
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
