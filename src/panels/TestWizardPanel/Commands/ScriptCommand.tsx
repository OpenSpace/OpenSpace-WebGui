import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: string;
}

export function ScriptCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const [script, setScript] = useState(initialValue ?? '');

  return (
    <>
      <Layout.GrowingSection>
        <Stack gap={'sm'}>
          <Textarea
            label={t('script.label')}
            placeholder={t('script.placeholder')}
            value={script}
            onChange={(event) => setScript(event.currentTarget.value)}
            autosize
            minRows={2}
          />
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onSubmit({ type: 'script', value: script })}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={!script}
        />
      </Layout.FixedSection>
    </>
  );
}
