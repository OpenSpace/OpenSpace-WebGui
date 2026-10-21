import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, NumberInput, Stack } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function DeltaTimeCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);

  const [deltaTime, setDeltaTime] = useState<number | string>(0);

  function applyCurrentDeltaTime() {
    if (targetDeltaTime !== undefined) {
      setDeltaTime(targetDeltaTime);
    }
  }

  return (
    <Stack gap={'sm'}>
      <Stack gap={'xs'}>
        <NumberInput
          label={t('delta-time')}
          value={deltaTime}
          onChange={setDeltaTime}
          min={0}
          step={0.1}
        />
        <Button
          size={'xs'}
          variant={'light'}
          onClick={applyCurrentDeltaTime}
          disabled={targetDeltaTime === undefined}
        >
          {t('fetch-from-openspace')}
        </Button>
      </Stack>
      <AddCommandButton
        onClick={() => onAdd({ type: 'deltatime', value: Number(deltaTime) })}
      />
    </Stack>
  );
}
