import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function ActionCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const actions = useAppSelector((state) => state.actions.actions);

  const [action, setAction] = useState('');

  const actionOptions = useMemo(
    () =>
      actions.map((a) => ({ value: a.identifier, label: `${a.name} (${a.identifier})` })),
    [actions]
  );

  return (
    <Stack gap={'sm'}>
      {actionOptions.length > 0 ? (
        <Select
          label={t('action.select-label')}
          data={actionOptions}
          value={action}
          onChange={(v) => {
            if (v) {
              setAction(v);
            }
          }}
          searchable
        />
      ) : (
        <TextInput
          label={t('action.identifier-label')}
          placeholder={t('action.identifier-placeholder')}
          value={action}
          onChange={(e) => setAction(e.currentTarget.value)}
        />
      )}
      <AddCommandButton
        onClick={() => onAdd({ type: 'action', value: action })}
        disabled={!action}
      />
    </Stack>
  );
}
