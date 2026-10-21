import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useFileDialog } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { MinusIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { NotificationLevel } from '@/types/enums';
import { useSaveFile } from '@/util/fileIOhooks';

import { AddCommandForm } from './AddCommandForm';
import { isOsTest, OsTest, TestCommand } from './types';

interface CommandEntry {
  id: string;
  cmd: TestCommand;
}

/**
 * A panel for creating OpenSpace visual regression test files (`.ostest`).
 */
export function TestWizardPanel() {
  const { t } = useTranslation('panel-testwizard');
  const { t: tLabel } = useTranslation('panel-testwizard', {
    keyPrefix: 'command-labels'
  });
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();
  const saveFile = useSaveFile();

  const [profile, setProfile] = useState('');
  const [name, setName] = useState('');
  const [commands, setCommands] = useState<CommandEntry[]>([]);

  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.ostest',
    resetOnOpen: true,
    onChange: loadFile
  });

  function commandLabel(cmd: TestCommand): string {
    switch (cmd.type) {
      case 'screenshot':
        return tLabel('screenshot');
      case 'wait':
        return tLabel('wait', { value: cmd.value });
      case 'deltatime':
        return tLabel('deltatime', { value: cmd.value });
      case 'pause':
        return tLabel('pause', {
          value: cmd.value ? tLabel('pause-on') : tLabel('pause-off')
        });
      case 'script':
        return tLabel('script', { value: cmd.value });
      case 'time':
        return tLabel('time', { value: cmd.value });
      case 'asset':
        return tLabel('asset', { value: cmd.value });
      case 'action':
        return tLabel('action', { value: cmd.value });
      case 'property':
        return tLabel('property', {
          property: cmd.value.property,
          value: String(cmd.value.value)
        });
      case 'navigationstate':
        return tLabel('navigationstate', { anchor: cmd.value.anchor });
      default:
        throw new Error(`Unhandled command type: ${cmd}`);
    }
  }

  async function fetchProfile() {
    if (!luaApi) {
      return;
    }
    const profilePath = await luaApi.profileName();
    const slashIdx = profilePath.lastIndexOf('/');
    const dotIdx = profilePath.indexOf('.');
    setProfile(profilePath.slice(slashIdx + 1, dotIdx !== -1 ? dotIdx : undefined));
  }

  async function loadFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }
    try {
      const test: unknown = JSON.parse(await file.text());
      if (!isOsTest(test)) {
        throw new Error(t('load-error.invalid-file'));
      }
      setProfile(test.profile ?? '');
      setCommands(
        test.commands
          .filter((c) => c.type !== 'screenshot')
          .map((cmd) => ({ id: crypto.randomUUID(), cmd }))
      );
      setName(file.name.replace(/\.ostest$/i, ''));
    } catch (e) {
      dispatch(
        handleNotificationLogging(
          t('load-error.title', { name: file.name }),
          e,
          NotificationLevel.Error
        )
      );
    }
  }

  function handleAdd(cmd: TestCommand) {
    setCommands((prev) => [...prev, { id: crypto.randomUUID(), cmd }]);
  }

  function handleRemove(index: number) {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  }

  function handleReorder({ updatedData }: OnDragEndProps<CommandEntry>) {
    setCommands(updatedData);
  }

  async function handleSave() {
    const test: OsTest = {
      profile,
      commands: [...commands.map((e) => e.cmd), { type: 'screenshot' }]
    };
    const result = await saveFile(
      `${JSON.stringify(test, null, 2)}\n`,
      `${name}.ostest`,
      '.ostest',
      'text/plain'
    );
    if (result.status === 'saved') {
      notifications.show({
        title: t('saved.title'),
        message: t('saved.message', { name: result.name }),
        color: 'green'
      });
    } else if (result.status === 'downloaded') {
      notifications.show({
        title: t('downloaded.title'),
        message: t('downloaded.message', { name: result.name }),
        color: 'blue'
      });
    }
  }

  return (
    <Container>
      <Stack gap={'md'}>
        <Stack gap={'xs'}>
          <Divider
            label={
              <Group gap={'xs'}>
                {t('sections.test')}
                <InfoBox w={300}>
                  <Text>
                    <Trans t={t} i18nKey={'info'} components={{ code: <code /> }} />
                  </Text>
                </InfoBox>
              </Group>
            }
            labelPosition={'left'}
          />
          <TextInput
            label={t('test-name.label')}
            placeholder={t('test-name.placeholder')}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Group align={'flex-end'} gap={'xs'} wrap={'nowrap'}>
            <TextInput
              style={{ flex: 1 }}
              label={t('profile.label')}
              placeholder={t('profile.placeholder')}
              value={profile}
              onChange={(e) => setProfile(e.currentTarget.value)}
            />
            <Button variant={'light'} disabled={!luaApi} onClick={fetchProfile}>
              {t('profile.fetch')}
            </Button>
          </Group>
        </Stack>

        <Stack gap={'xs'}>
          <Divider label={t('sections.add-command')} labelPosition={'left'} />
          <AddCommandForm onAdd={handleAdd} />
        </Stack>

        <Stack gap={'xs'}>
          <Divider
            label={t('sections.commands', { number: commands.length })}
            labelPosition={'left'}
          />
          {commands.length === 0 && (
            <Text c={'dimmed'} size={'sm'}>
              {t('no-commands')}
            </Text>
          )}
          <DragReorderList<CommandEntry>
            id={'testCommands'}
            data={commands}
            keyFunc={(entry) => entry.id}
            onDragEnd={handleReorder}
            gap={'xs'}
            renderFunc={(entry, i) => (
              <Group justify={'space-between'} wrap={'nowrap'}>
                <Text size={'sm'} style={{ overflowWrap: 'anywhere' }}>
                  {commandLabel(entry.cmd)}
                </Text>
                <ActionIcon
                  variant={'light'}
                  size={'sm'}
                  color={'red'}
                  onClick={() => handleRemove(i)}
                  aria-label={`${t('remove-command-aria-label')}: ${commandLabel(entry.cmd)}`}
                >
                  <MinusIcon />
                </ActionIcon>
              </Group>
            )}
          />
        </Stack>

        <Group grow>
          <Button variant={'light'} onClick={fileDialog.open}>
            {t('load')}
          </Button>
          <Button variant={'filled'} onClick={handleSave} disabled={!profile || !name}>
            {t('save')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
