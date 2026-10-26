import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Stack, Text } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { VirtualSelect } from '@/components/VirtualSelect/VirtualSelect';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { TestCommand } from '../types';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function PropertyCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const propertyUris = useAppSelector(propertySelectors.selectIds);

  const [uri, setUri] = useState('');

  // Derived from `uri`, so it comes after the state
  const property = useAppSelector((state) => propertySelectors.selectById(state, uri));

  const { value, setValue, reset } = useResettableValue(property?.value);

  function handleUriChange(newUri: string) {
    setUri(newUri);
    setValue(undefined);
  }

  function handleAdd() {
    if (value !== undefined) {
      onAdd({ type: 'property', value: { property: uri, value } });
    }
  }

  return (
    <Stack gap={'sm'}>
      <Stack gap={'xs'}>
        <VirtualSelect
          label={t('property.uri-label')}
          placeholder={t('property.uri-placeholder')}
          nothingFoundMessage={t('property.uri-nothing-found')}
          data={propertyUris}
          value={uri}
          onChange={handleUriChange}
        />
        {property && (
          <>
            <Card withBorder>
              <Text size={'sm'} fw={500} mb={'xs'}>
                {t('property.preview')}
              </Text>
              <Property uri={uri} />
            </Card>
          </>
        )}
        {value !== undefined && (
          <ResettableField
            label={t('property.value-label')}
            align={'center'}
            onReset={reset}
            disabled={property === undefined}
          >
            <Text size={'sm'} c={'dimmed'}>
              {t('property.selected-value', { value: JSON.stringify(value) })}
            </Text>
          </ResettableField>
        )}
      </Stack>
      <AddCommandButton onClick={handleAdd} disabled={value === undefined} />
    </Stack>
  );
}
