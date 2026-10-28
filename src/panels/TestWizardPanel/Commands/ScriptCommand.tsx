import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function ScriptCommand({ onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [script, setScript] = useState('');

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
          onSave={() => onAdd({ type: 'script', value: script })}
          onCancel={onCancel}
          saveLabel={'add'}
          saveDisabled={!script}
        />
      </Layout.FixedSection>
    </>
  );
}
