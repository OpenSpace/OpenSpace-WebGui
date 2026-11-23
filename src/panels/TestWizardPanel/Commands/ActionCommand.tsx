import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useAppSelector } from '@/redux/hooks';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: string;
}

export function ActionCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const actions = useAppSelector((state) => state.actions.actions);
  const [action, setAction] = useState(initialValue ?? '');

  const actionOptions = useMemo(
    () =>
      actions.map((availableAction) => ({
        value: availableAction.identifier,
        label: `${availableAction.name} (${availableAction.identifier})`
      })),
    [actions]
  );

  return (
    <>
      <Layout.GrowingSection>
        <Stack gap={'sm'}>
          {actionOptions.length > 0 ? (
            <Select
              label={t('action.select-label')}
              data={actionOptions}
              value={action}
              onChange={(value) => {
                if (value) {
                  setAction(value);
                }
              }}
              searchable
            />
          ) : (
            <TextInput
              label={t('action.identifier-label')}
              placeholder={t('action.identifier-placeholder')}
              value={action}
              onChange={(event) => setAction(event.currentTarget.value)}
            />
          )}
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onSubmit({ type: 'action', value: action })}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={!action}
        />
      </Layout.FixedSection>
    </>
  );
}
