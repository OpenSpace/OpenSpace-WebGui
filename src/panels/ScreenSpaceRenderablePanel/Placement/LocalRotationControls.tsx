import { ActionIcon, Fieldset, Group, Text, Tooltip } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { useProperty } from '@/hooks/properties';
import { ArrowsLeftRightIcon, ArrowsUpDownIcon, DeleteIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { AngleInput } from './AngleInput';

interface Props {
  propertyUri: Uri;
}

export function LocalRotationControls({ propertyUri }: Props) {
  const [value, setValue, meta] = useProperty('Vec3Property', propertyUri);

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${propertyUri}`);
  }

  return (
    <Fieldset
      legend={
        <PropertyLabel
          name={'Local rotation'}
          description={meta.description}
          visibility={meta.visibility}
          uri={propertyUri}
        />
      }
      bg={'transparent'}
      p={'xs'}
      mt={'xs'}
    >
      <Group gap={'xs'}>
        <AngleInput
          value={value[0]}
          onChange={(newValue) => setValue([Number(newValue), value[1], value[2]])}
          disabled={meta.isReadOnly}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsLeftRightIcon size={IconSize.xs} />
              <Text size={'sm'}>Roll</Text>
            </Group>
          }
        />
        <AngleInput
          value={value[1]}
          onChange={(newValue) => setValue([value[0], Number(newValue), value[2]])}
          disabled={meta.isReadOnly}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsUpDownIcon size={IconSize.xs} />
              <Text size={'sm'}>Pitch</Text>
            </Group>
          }
        />

        <AngleInput
          value={value[2]}
          onChange={(newValue) => setValue([value[0], value[1], Number(newValue)])}
          disabled={meta.isReadOnly}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsLeftRightIcon size={IconSize.xs} />
              <Text size={'sm'}>Yaw</Text>
            </Group>
          }
        />

        <Tooltip label={'Reset to all zeros'}>
          <ActionIcon
            color={'red'}
            variant={'outline'}
            size={'sm'}
            aria-label={'Reset local rotation'}
            onClick={() => setValue([0, 0, 0])}
          >
            <DeleteIcon size={IconSize.xs} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Fieldset>
  );
}
