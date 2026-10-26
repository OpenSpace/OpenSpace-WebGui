import { useTranslation } from 'react-i18next';
import { Stack, Switch } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function PauseCommand({ onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const currentIsPaused = useAppSelector((state) => state.time.isPaused);

  useSubscribeToTime();
  const {
    value: isPaused,
    setValue: setIsPaused,
    reset
  } = useResettableValue(currentIsPaused);

  const label = t('pause');

  function handleAdd() {
    if (isPaused !== undefined) {
      onAdd({ type: 'pause', value: isPaused });
    }
  }

  return (
    <Stack gap={'sm'}>
      <ResettableField
        label={label}
        align={'center'}
        onReset={reset}
        disabled={currentIsPaused === undefined}
      >
        <Switch
          label={label}
          checked={isPaused ?? false}
          onChange={(event) => setIsPaused(event.currentTarget.checked)}
        />
      </ResettableField>
      <SaveCancelButtons
        onSave={handleAdd}
        onCancel={onCancel}
        saveLabel={'add'}
        saveDisabled={isPaused === undefined}
      />
    </Stack>
  );
}
