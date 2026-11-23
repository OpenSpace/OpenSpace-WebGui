import { useTranslation } from 'react-i18next';
import { Stack, Switch } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: boolean;
}

export function PauseCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const currentIsPaused = useAppSelector((state) => state.time.isPaused);
  useSubscribeToTime();
  const {
    value: isPaused,
    setValue: setIsPaused,
    reset
  } = useResettableValue(currentIsPaused, initialValue);

  const label = t('pause.label');

  function handleSubmitCommand() {
    if (isPaused !== undefined) {
      onSubmit({ type: 'pause', value: isPaused });
    }
  }

  return (
    <>
      <Layout.GrowingSection>
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
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={handleSubmitCommand}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={isPaused === undefined}
        />
      </Layout.FixedSection>
    </>
  );
}
