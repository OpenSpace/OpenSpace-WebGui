import { useTranslation } from 'react-i18next';
import { NumberInput, Stack } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function DeltaTimeCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const currentDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);

  useSubscribeToTime();
  const {
    value: deltaTime,
    setValue: setDeltaTime,
    reset
  } = useResettableValue<number | string>(currentDeltaTime);

  const label = t('delta-time');

  return (
    <Stack gap={'sm'}>
      <ResettableField
        label={label}
        onReset={reset}
        disabled={currentDeltaTime === undefined}
      >
        <NumberInput
          label={label}
          value={deltaTime ?? ''}
          onChange={setDeltaTime}
          min={0}
          step={0.1}
        />
      </ResettableField>
      <AddCommandButton
        onClick={() => onAdd({ type: 'deltatime', value: Number(deltaTime) })}
        disabled={deltaTime === undefined || deltaTime === ''}
      />
    </Stack>
  );
}
