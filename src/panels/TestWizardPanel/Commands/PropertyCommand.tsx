import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Stack, Text } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { Property } from '@/components/Property/Property';
import { VirtualSelect } from '@/components/VirtualSelect/VirtualSelect';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';

import { useResettableValue } from '../hooks';
import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { PropertyCommandValue, TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: PropertyCommandValue;
}

export function PropertyCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const propertyUris = useAppSelector(propertySelectors.selectIds);
  const [uri, setUri] = useState(initialValue?.property ?? '');

  // Derived from `uri`, so it comes after the state
  const property = useAppSelector((state) => propertySelectors.selectById(state, uri));
  const { value, setValue, reset } = useResettableValue(
    property?.value,
    initialValue?.value
  );

  function handleUriChange(newUri: string) {
    setUri(newUri);
    setValue(undefined);
  }

  function handleSubmitCommand() {
    if (value !== undefined) {
      onSubmit({ type: 'property', value: { property: uri, value } });
    }
  }

  return (
    <>
      <Layout.GrowingSection>
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
            <Card withBorder>
              <Text size={'sm'} fw={500} mb={'xs'}>
                {t('property.preview')}
              </Text>
              <Property uri={uri} />
            </Card>
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
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={handleSubmitCommand}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={value === undefined}
        />
      </Layout.FixedSection>
    </>
  );
}
