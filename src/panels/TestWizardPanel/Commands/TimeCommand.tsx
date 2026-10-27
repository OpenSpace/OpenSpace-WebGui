import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { dateToOpenSpaceTimeString } from '@/util/time';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function TimeCommand({ onAdd, onCancel }: Props) {
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
    <>
      <Layout.GrowingSection>
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
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onAdd({ type: 'time', value: time })}
          onCancel={onCancel}
          saveLabel={'add'}
          saveDisabled={!time}
        />
      </Layout.FixedSection>
    </>
  );
}
