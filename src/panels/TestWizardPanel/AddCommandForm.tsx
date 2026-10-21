import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Text } from '@mantine/core';

import { ActionCommand } from './Commands/ActionCommand';
import { AssetCommand } from './Commands/AssetCommand';
import { DeltaTimeCommand } from './Commands/DeltaTimeCommand';
import { NavigationStateCommand } from './Commands/NavigationStateCommand';
import { PauseCommand } from './Commands/PauseCommand';
import { PropertyCommand } from './Commands/PropertyCommand';
import { ScriptCommand } from './Commands/ScriptCommand';
import { TimeCommand } from './Commands/TimeCommand';
import { WaitCommand } from './Commands/WaitCommand';
import { COMMAND_TYPES, CommandType, TestCommand } from './types';
import { isCommandType } from './util';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function AddCommandForm({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [type, setType] = useState<CommandType | null>(null);

  function handleAdd(command: TestCommand) {
    onAdd(command);
    setType(null);
  }

  function commandFields(commandType: CommandType) {
    switch (commandType) {
      case 'navigationstate':
        return <NavigationStateCommand onAdd={handleAdd} />;
      case 'asset':
        return <AssetCommand onAdd={handleAdd} />;
      case 'property':
        return <PropertyCommand onAdd={handleAdd} />;
      case 'wait':
        return <WaitCommand onAdd={handleAdd} />;
      case 'script':
        return <ScriptCommand onAdd={handleAdd} />;
      case 'time':
        return <TimeCommand onAdd={handleAdd} />;
      case 'pause':
        return <PauseCommand onAdd={handleAdd} />;
      case 'deltatime':
        return <DeltaTimeCommand onAdd={handleAdd} />;
      case 'action':
        return <ActionCommand onAdd={handleAdd} />;
      default:
        throw new Error(`Unhandled command type: ${commandType}`);
    }
  }

  return (
    <Stack gap={'sm'}>
      <Select
        label={t('type-label')}
        placeholder={t('type-placeholder')}
        data={COMMAND_TYPES.map((id) => ({ value: id, label: t(`types.${id}.label`) }))}
        value={type}
        onChange={(v) => setType(v !== null && isCommandType(v) ? v : null)}
        allowDeselect={false}
      />
      {type !== null && (
        <>
          <Text size={'sm'} c={'dimmed'}>
            {t(`types.${type}.description`)}
          </Text>
          {commandFields(type)}
        </>
      )}
    </Stack>
  );
}
