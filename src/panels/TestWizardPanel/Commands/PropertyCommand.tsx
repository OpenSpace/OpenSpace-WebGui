import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Stack, TextInput } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';

import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function PropertyCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [uri, setUri] = useState('');
  const [rawValue, setRawValue] = useState('');

  // Derived from `uri`, so it comes after the state
  const currentValue = useAppSelector(
    (state) => propertySelectors.selectById(state, uri)?.value
  );

  function applyCurrentValue() {
    if (currentValue !== undefined) {
      setRawValue(String(currentValue));
    }
  }

  function handleAdd() {
    let value: string | number | boolean = rawValue;
    if (rawValue.toLowerCase() === 'true') {
      value = true;
    } else if (rawValue.toLowerCase() === 'false') {
      value = false;
    } else if (rawValue !== '' && !Number.isNaN(Number(rawValue))) {
      value = Number(rawValue);
    }
    onAdd({ type: 'property', value: { property: uri, value } });
  }

  return (
    <Stack gap={'sm'}>
      <Stack gap={'xs'}>
        <TextInput
          label={t('property.uri-label')}
          placeholder={t('property.uri-placeholder')}
          value={uri}
          onChange={(e) => setUri(e.currentTarget.value)}
        />
        <Group align={'flex-end'} gap={'xs'}>
          <TextInput
            style={{ flex: 1 }}
            label={t('property.value-label')}
            description={t('property.value-description')}
            placeholder={t('property.value-placeholder')}
            value={rawValue}
            onChange={(e) => setRawValue(e.currentTarget.value)}
          />
          <Button
            size={'sm'}
            variant={'light'}
            onClick={applyCurrentValue}
            disabled={currentValue === undefined}
            mb={'xs'}
          >
            {t('property.fetch-value')}
          </Button>
        </Group>
      </Stack>
      <AddCommandButton onClick={handleAdd} disabled={!uri} />
    </Stack>
  );
}
