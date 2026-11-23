import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Stack } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: number;
}

export function WaitCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const [seconds, setSeconds] = useState<number | string>(initialValue ?? 0);

  return (
    <>
      <Layout.GrowingSection>
        <Stack gap={'sm'}>
          <NumberInput
            label={t('wait.label')}
            value={seconds}
            onChange={setSeconds}
            min={0}
            step={1}
          />
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onSubmit({ type: 'wait', value: Number(seconds) })}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
        />
      </Layout.FixedSection>
    </>
  );
}
