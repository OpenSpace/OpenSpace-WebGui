import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Text } from '@mantine/core';
import { useFileDialog } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

import { OnDragEndProps } from '@/components/DragReorderList/DragReorderList';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { NotificationLevel } from '@/types/enums';
import { useSaveFile } from '@/util/fileIOhooks';

import { AddCommandView } from './Views/AddCommandView';
import { OverviewView } from './Views/OverviewView';
import { StartView } from './Views/StartView';
import { useResettableValue } from './hooks';
import { CommandEntry, CommandType, OsTest, TestCommand } from './types';
import { isOsTest } from './util';

type View = 'start' | 'overview' | 'add-command';

/**
 * A panel for creating OpenSpace visual regression test files (`.ostest`).
 */
export function TestWizardPanel() {
  const { t } = useTranslation('panel-testwizard');

  const storeProfile = useAppSelector((state) => state.profile.name);

  const [view, setView] = useState<View>('start');
  const [name, setName] = useState('');
  const [commands, setCommands] = useState<CommandEntry[]>([]);
  const [commandType, setCommandType] = useState<CommandType | null>(null);

  const saveFile = useSaveFile();
  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.ostest',
    resetOnOpen: true,
    onChange: loadFile
  });
  const {
    value: profile = '',
    setValue: setProfile,
    reset: resetProfile
  } = useResettableValue(storeProfile);

  const dispatch = useAppDispatch();

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
      setProfile(test.profile ?? storeProfile);
      setCommands(
        test.commands
          .filter((command) => command.type !== 'screenshot')
          .map((command) => ({ id: crypto.randomUUID(), cmd: command }))
      );
      setName(file.name.replace(/\.ostest$/i, ''));
      setView('overview');
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

  function startNewTest() {
    setName('');
    setCommands([]);
    resetProfile();
    setView('overview');
  }

  function handleAdd(cmd: TestCommand) {
    setCommands((previousCommands) => [
      ...previousCommands,
      { id: crypto.randomUUID(), cmd }
    ]);
    setView('overview');
  }

  function confirmDiscard(onConfirm: () => void) {
    modals.openConfirmModal({
      title: t('discard-modal.title'),
      children: <Text>{t('discard-modal.description')}</Text>,
      labels: {
        confirm: t('discard-modal.confirm'),
        cancel: t('discard-modal.cancel')
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm
    });
  }

  function handleCancel() {
    if (name === '' && commands.length === 0) {
      setView('start');
      return;
    }
    confirmDiscard(() => setView('start'));
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
      `${name.trim()}.ostest`,
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
    <Container h={'100%'}>
      {view === 'start' && (
        <StartView onLoadTest={fileDialog.open} onNewTest={startNewTest} />
      )}
      {view === 'overview' && (
        <OverviewView
          name={name}
          onNameChange={setName}
          profile={profile}
          onProfileChange={setProfile}
          onProfileReset={resetProfile}
          isProfileResetDisabled={storeProfile === undefined}
          commands={commands}
          onReorder={handleReorder}
          onRemove={handleRemove}
          commandType={commandType}
          onCommandTypeChange={setCommandType}
          onAddCommand={() => setView('add-command')}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {view === 'add-command' && commandType !== null && (
        <AddCommandView
          type={commandType}
          onAdd={handleAdd}
          onCancel={() => confirmDiscard(() => setView('overview'))}
        />
      )}
    </Container>
  );
}
