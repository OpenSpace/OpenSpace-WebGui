import {
  ActionIcon,
  Box,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Text
} from '@mantine/core';

import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyOwnerChildren } from '@/components/PropertyOwner/PropertyOwnerChildren';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { DeleteIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { AngleInput } from './AngleInput';

interface Props {
  uri: Uri;
}

export function ScreenSpacePlacementOwner({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const visibleProperties = useVisibleProperties(propertyOwner);

  const uris = {
    useRae: `${uri}.UseRadiusAzimuthElevation`,
    posCartesian: `${uri}.CartesianPosition`,
    posRae: `${uri}.RadiusAzimuthElevation`,
    localRotation: `${uri}.Rotation`
  };

  const [useRaeValue, setUseRae, useRaeMeta] = useProperty('BoolProperty', uris.useRae);
  const [posCartesianValue, setPosCartesian, posCartesianMeta] = useProperty(
    'Vec3Property',
    uris.posCartesian
  );
  const [posRaeValue, setPosRae, posRaeMeta] = useProperty('Vec3Property', uris.posRae);
  const [localRotationValue, setLocalRotation, localRotationMeta] = useProperty(
    'Vec3Property',
    uris.localRotation
  );

  if (
    !posRaeValue ||
    !posRaeMeta ||
    !posCartesianValue ||
    !posCartesianMeta ||
    !useRaeMeta ||
    !localRotationValue ||
    !localRotationMeta
  ) {
    throw Error(`Missing placement properties of uri: ${uri}`);
  }

  const hideProperties = Object.values(uris);

  const filteredProperties = visibleProperties.filter(
    (property) => !hideProperties.includes(property)
  );

  return (
    <>
      <Box ml={'xs'}>
        {/* <Select
          label={
            <PropertyLabel
              name={'Placement mode'}
              description={useRaeMeta!.description} // TODO: make custom description
              visibility={useRaeMeta!.visibility}
              uri={uris.useRae}
            />
          }
          allowDeselect={false}
          value={useRaeValue ? 'RAE' : 'XYZ'}
          onChange={(value) => setUseRae(value === 'RAE')}
          data={[
            { value: 'RAE', label: 'RAE (Spherical)' },
            { value: 'XYZ', label: 'XYZ (Cartesian)' }
          ]}
        /> */}
        <Group wrap={'nowrap'} gap={'xs'} mb={5}>
          <SegmentedControl
            value={useRaeValue ? 'RAE' : 'XYZ'}
            data={[
              { value: 'RAE', label: 'RAE (spherical)' },
              { value: 'XYZ', label: 'XYZ (Cartesian)' }
            ]}
            onChange={(value) => setUseRae(value === 'RAE')}
            aria-label={'Placement mode'}
          />
        </Group>
        {useRaeValue ? (
          <Fieldset
            legend={
              <PropertyLabel
                name={'Spherical position'}
                description={posRaeMeta.description}
                visibility={posRaeMeta.visibility}
                uri={uris.posRae}
              />
            }
            p={'xs'}
          >
            <Group gap={'xs'} align={'flex-start'}>
              <Stack flex={1} gap={2}>
                <Text size={'sm'}>Radius (m)</Text>
                <NumberInput
                  aria-label={'Radius'}
                  value={posRaeValue[0]}
                  size={'xs'}
                  step={posRaeMeta.additionalData.step[0]}
                  disabled={posRaeMeta.isReadOnly}
                  decimalScale={2}
                  onChange={(value) =>
                    setPosRae([Number(value), posRaeValue[1], posRaeValue[2]])
                  }
                  mb={5}
                />
                <NumericSlider
                  value={posRaeValue[0]}
                  disabled={posRaeMeta.isReadOnly}
                  min={posRaeMeta.additionalData.min[0]}
                  max={posRaeMeta.additionalData.max[0]}
                  step={posRaeMeta.additionalData.step[0]}
                  onInput={(value) => setPosRae([value, posRaeValue[1], posRaeValue[2]])}
                />
              </Stack>
              <AngleInput
                value={posRaeValue[1]}
                onChange={(value) => setPosRae([posRaeValue[0], value, posRaeValue[2]])}
                disabled={posRaeMeta.isReadOnly}
                label={'Azimuth'}
              />

              <AngleInput
                value={posRaeValue[2]}
                onChange={(value) => setPosRae([posRaeValue[0], posRaeValue[1], value])}
                disabled={posRaeMeta.isReadOnly}
                label={'Elevation'}
              />
            </Group>
          </Fieldset>
        ) : (
          <Fieldset
            legend={
              <PropertyLabel
                name={'Cartesian position'}
                description={posCartesianMeta.description}
                visibility={posCartesianMeta.visibility}
                uri={uris.posCartesian}
              />
            }
            p={'xs'}
          >
            <Group gap={'xs'}>
              <Text size={'sm'}>x</Text>
              <NumberInput
                flex={1}
                maw={70}
                miw={50}
                size={'xs'}
                value={posCartesianValue[0]}
                step={posCartesianMeta.additionalData.step[0]}
                decimalScale={3}
                onChange={(value) =>
                  setPosCartesian([
                    Number(value),
                    posCartesianValue[1],
                    posCartesianValue[2]
                  ])
                }
              />
              <NumericSlider
                value={posCartesianValue[0]}
                flex={1}
                miw={50}
                disabled={posCartesianMeta.isReadOnly}
                min={posCartesianMeta.additionalData.min[0]}
                max={posCartesianMeta.additionalData.max[0]}
                step={posCartesianMeta.additionalData.step[0]}
                exponent={posCartesianMeta.additionalData.exponent}
                onInput={(value) =>
                  setPosCartesian([
                    Number(value),
                    posCartesianValue[1],
                    posCartesianValue[2]
                  ])
                }
              />
            </Group>
            <Group gap={'xs'}>
              <Text size={'sm'}>y</Text>
              <NumberInput
                flex={1}
                maw={70}
                miw={50}
                size={'xs'}
                value={posCartesianValue[1]}
                step={posCartesianMeta.additionalData.step[1]}
                decimalScale={3}
                onChange={(value) =>
                  setPosCartesian([
                    posCartesianValue[0],
                    Number(value),
                    posCartesianValue[2]
                  ])
                }
              />
              <NumericSlider
                value={posCartesianValue[1]}
                flex={1}
                miw={50}
                disabled={posCartesianMeta.isReadOnly}
                min={posCartesianMeta.additionalData.min[1]}
                max={posCartesianMeta.additionalData.max[1]}
                step={posCartesianMeta.additionalData.step[1]}
                exponent={posCartesianMeta.additionalData.exponent}
                onInput={(value) =>
                  setPosCartesian([
                    posCartesianValue[0],
                    Number(value),
                    posCartesianValue[2]
                  ])
                }
              />
            </Group>
            <Group gap={'xs'}>
              <Text size={'sm'}>z</Text>
              <NumberInput
                flex={1}
                maw={70}
                miw={50}
                size={'xs'}
                value={posCartesianValue[2]}
                step={posCartesianMeta.additionalData.step[2]}
                decimalScale={3}
                onChange={(value) =>
                  setPosCartesian([
                    posCartesianValue[0],
                    posCartesianValue[1],
                    Number(value)
                  ])
                }
              />
              <NumericSlider
                value={posCartesianValue[2]}
                flex={1}
                miw={50}
                disabled={posCartesianMeta.isReadOnly}
                min={posCartesianMeta.additionalData.min[2]}
                max={posCartesianMeta.additionalData.max[2]}
                step={posCartesianMeta.additionalData.step[2]}
                exponent={posCartesianMeta.additionalData.exponent}
                onInput={(value) =>
                  setPosCartesian([
                    posCartesianValue[0],
                    posCartesianValue[1],
                    Number(value)
                  ])
                }
              />
            </Group>
          </Fieldset>
        )}
        <Fieldset
          legend={
            <PropertyLabel
              name={'Local rotation'}
              description={localRotationMeta.description}
              visibility={localRotationMeta.visibility}
              uri={uris.localRotation}
            />
          }
          p={'xs'}
          mt={'xs'}
        >
          <Group gap={'xs'}>
            <AngleInput
              value={localRotationValue[0]}
              onChange={(value) =>
                setLocalRotation([value, localRotationValue[1], localRotationValue[2]])
              }
              disabled={localRotationMeta.isReadOnly}
              label={'Roll'}
            />
            <AngleInput
              value={localRotationValue[1]}
              onChange={(value) =>
                setLocalRotation([localRotationValue[0], value, localRotationValue[2]])
              }
              disabled={localRotationMeta.isReadOnly}
              label={'Pitch'}
            />

            <AngleInput
              value={localRotationValue[2]}
              onChange={(value) =>
                setLocalRotation([localRotationValue[0], localRotationValue[1], value])
              }
              disabled={localRotationMeta.isReadOnly}
              label={'Yaw'}
            />

            <ActionIcon
              color={'red'}
              variant={'outline'}
              size={'sm'}
              aria-label={'Reset local rotation'}
              onClick={() => setLocalRotation([0, 0, 0])}
            >
              <DeleteIcon size={IconSize.xs} />
            </ActionIcon>
          </Group>
        </Fieldset>
      </Box>
      <PropertyOwnerChildren
        properties={filteredProperties}
        subowners={propertyOwner.subowners ?? []}
      />
    </>
  );
}
