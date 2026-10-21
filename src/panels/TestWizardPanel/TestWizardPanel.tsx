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

import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { MinusIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { NotificationLevel } from '@/types/enums';
import { useSaveFile } from '@/util/fileIOhooks';

import { AddCommandForm } from './AddCommandForm';
import { OsTest, TestCommand } from './types';
import { isOsTest } from './util';

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

  const storeProfile = useAppSelector((state) => state.profile.name) ?? '';

  const [name, setName] = useState('');
  const [editedProfile, setEditedProfile] = useState<string | null>(null);
  const [commands, setCommands] = useState<CommandEntry[]>([]);

  const saveFile = useSaveFile();
  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.ostest',
    resetOnOpen: true,
    onChange: loadFile
  });

  // Follows the profile in the store until the user edits it or loads a file
  const profile = editedProfile ?? storeProfile;

  const dispatch = useAppDispatch();

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
      setEditedProfile(test.profile ?? null);
      setCommands(
        test.commands
          .filter((command) => command.type !== 'screenshot')
          .map((command) => ({ id: crypto.randomUUID(), cmd: command }))
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
    setCommands((previousCommands) => [
      ...previousCommands,
      { id: crypto.randomUUID(), cmd }
    ]);
  }

  function handleRemove(index: number) {
    setCommands((previousCommands) =>
      previousCommands.filter((_, commandIndex) => commandIndex !== index)
    );
  }

  function handleReorder({ updatedData }: OnDragEndProps<CommandEntry>) {
    setCommands(updatedData);
  }

  async function handleSave() {
    const test: OsTest = {
      profile,
      commands: [...commands.map((entry) => entry.cmd), { type: 'screenshot' }]
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
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <TextInput
            label={t('profile.label')}
            placeholder={t('profile.placeholder')}
            value={profile}
            onChange={(event) => setEditedProfile(event.currentTarget.value)}
          />
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
            renderFunc={(entry, index) => (
              <Group justify={'space-between'} wrap={'nowrap'}>
                <Text size={'sm'} style={{ overflowWrap: 'anywhere' }}>
                  {commandLabel(entry.cmd)}
                </Text>
                <ActionIcon
                  variant={'light'}
                  size={'sm'}
                  color={'red'}
                  onClick={() => handleRemove(index)}
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
