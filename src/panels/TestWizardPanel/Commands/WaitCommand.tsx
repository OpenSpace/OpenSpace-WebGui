import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Stack } from '@mantine/core';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function WaitCommand({ onAdd, onCancel }: Props) {
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
      <SaveCancelButtons
        onSave={() => onAdd({ type: 'wait', value: Number(seconds) })}
        onCancel={onCancel}
        saveLabel={'add'}
      />
    </Stack>
  );
}
