import { Anchor, Group, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { ConsoleIcon, ExitAppIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

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
      <Menu.Label>
        {!profile.initalized ? (
          <LoadingBlocks n={1} />
        ) : (
          <Group justify={'space-between'} align={'center'}>
            Profile: {profile.name}
            <InfoBox>
              <Text size={'xs'} mb={'xs'} style={{ wordBreak: 'break-word' }}>
                {profile.filePath}
              </Text>
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
            </InfoBox>
          </Group>
        )}
      </Menu.Label>

      <Menu.Divider />
      <Menu.Item onClick={toggleLuaConsole} leftSection={<ConsoleIcon />}>
        Toggle Console
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        Quit OpenSpace
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
