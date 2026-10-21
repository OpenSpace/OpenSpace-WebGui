import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Stack } from '@mantine/core';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function WaitCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [seconds, setSeconds] = useState<number | string>(0);

  return (
    <Stack gap={'sm'}>
      <NumberInput
        label={t('wait-seconds')}
        value={seconds}
        onChange={setSeconds}
        min={0}
        step={1}
      />
      <AddCommandButton onClick={() => onAdd({ type: 'wait', value: Number(seconds) })} />
    </Stack>
  );
}
