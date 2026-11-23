import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Select, Stack, TextInput } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { WarningIcon } from '@/icons/icons';
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

  // An action from a loaded test file might not exist in OpenSpace. Keep it in the list
  // so that it can still be seen and kept, but warn about it
  const isMissing =
    action !== '' &&
    actions.length > 0 &&
    !actions.some((availableAction) => availableAction.identifier === action);

  const actionOptions = useMemo(() => {
    const options = actions.map((availableAction) => ({
      value: availableAction.identifier,
      label: `${availableAction.name} (${availableAction.identifier})`
    }));
    return isMissing ? [...options, { value: action, label: action }] : options;
  }, [actions, isMissing, action]);

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
          {isMissing && (
            <Alert color={'yellow'} variant={'light'} icon={<WarningIcon />}>
              {t('action.not-found')}
            </Alert>
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
