import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack, TextInput } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { dateToOpenSpaceTimeString } from '@/util/time';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function TimeCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [time, setTime] = useState('');

  const currentTime = useSubscribeToTime();

  function applyCurrentTime() {
    if (currentTime !== undefined) {
      setTime(dateToOpenSpaceTimeString(new Date(currentTime)));
    }
  }

  return (
    <Stack gap={'sm'}>
      <Stack gap={'xs'}>
        <TextInput
          label={t('time.label')}
          placeholder={t('time.placeholder')}
          value={time}
          onChange={(e) => setTime(e.currentTarget.value)}
        />
        <Button
          size={'xs'}
          variant={'light'}
          onClick={applyCurrentTime}
          disabled={currentTime === undefined}
        >
          {t('fetch-from-openspace')}
        </Button>
      </Stack>
      <AddCommandButton
        onClick={() => onAdd({ type: 'time', value: time })}
        disabled={!time}
      />
    </Stack>
  );
}
