import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { dateToOpenSpaceTimeString } from '@/util/time';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function TimeCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const currentTime = useSubscribeToTime();

  const currentTimeString =
    currentTime !== undefined
      ? dateToOpenSpaceTimeString(new Date(currentTime))
      : undefined;
  const {
    value: time = '',
    setValue: setTime,
    reset
  } = useResettableValue(currentTimeString);

  const label = t('time.label');

  return (
    <Stack gap={'sm'}>
      <ResettableField
        label={label}
        onReset={reset}
        disabled={currentTimeString === undefined}
      >
        <TextInput
          label={label}
          placeholder={t('time.placeholder')}
          value={time}
          onChange={(event) => setTime(event.currentTarget.value)}
        />
      </ResettableField>
      <AddCommandButton
        onClick={() => onAdd({ type: 'time', value: time })}
        disabled={!time}
      />
    </Stack>
  );
}
