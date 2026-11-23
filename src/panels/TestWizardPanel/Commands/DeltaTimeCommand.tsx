import { useTranslation } from 'react-i18next';
import { NumberInput, Stack } from '@mantine/core';

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
  initialValue?: number;
}

export function DeltaTimeCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const currentDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  useSubscribeToTime();
  const {
    value: deltaTime,
    setValue: setDeltaTime,
    reset
  } = useResettableValue<number | string>(currentDeltaTime, initialValue);

  const label = t('deltatime.label');

  return (
    <>
      <Layout.GrowingSection>
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
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onSubmit({ type: 'deltatime', value: Number(deltaTime) })}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={deltaTime === undefined || deltaTime === ''}
        />
      </Layout.FixedSection>
    </>
  );
}
