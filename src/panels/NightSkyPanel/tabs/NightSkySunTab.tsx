import { useState } from 'react';
import { Button, Divider, Group, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { CalendarIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

export function NightSkySunTab() {
  const openspace = useOpenSpaceApi();

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const addedTrails = Object.values(propertyOwners).filter((owner) =>
    owner!.tags.includes('sun_trail')
  );

  const AngularSizeKey = 'Scene.EarthAtmosphere.Renderable.SunAngularSize';
  const [angularSize, setAngularSize] = useProperty('FloatProperty', AngularSizeKey);

  const [trailDate, setTrailDate] = useState<Date | null>(null);

  function addTrail(date: string): void {
    openspace?.action.triggerAction('os.nightsky.AddSunTrail', { Date: date });
  }

  return (
    <>
      <Title order={2} my={'sm'}>
        Glare
      </Title>
      <Group gap={'xs'} my={'md'}>
        <Button onClick={() => openspace?.fadeIn('Scene.SunGlare.Renderable')}>
          Show Glare
        </Button>
        <Button onClick={() => openspace?.fadeOut('Scene.SunGlare.Renderable')}>
          Hide Glare
        </Button>
      </Group>
      {angularSize !== undefined ? (
        <>
          <Title order={2}>Size</Title>
          <Group my={'md'} gap={'xs'}>
            <Button
              onClick={() => openspace?.setPropertyValueSingle(AngularSizeKey, 0.3)}
            >
              Default Angular Size
            </Button>
            <Button
              onClick={() => openspace?.setPropertyValueSingle(AngularSizeKey, 0.6)}
            >
              Large Angular Size
            </Button>
            <Button
              onClick={() => openspace?.setPropertyValueSingle(AngularSizeKey, 0.8)}
            >
              Extra Large Angular Size
            </Button>
            <Button onClick={() => setAngularSize(angularSize + 0.1)}>+</Button>
            <Button onClick={() => setAngularSize(angularSize - 0.1)}>-</Button>
          </Group>
        </>
      ) : (
        <>
          <Text>Could not find Sun Angular Size settings</Text>
        </>
      )}

      <Divider mt={'xl'} mb={'md'}></Divider>
      <Title order={2}>Trails</Title>
      <Group my={'md'} gap={'xs'}>
        <Button onClick={() => addTrail('NOW')}>Add trail for simulation date</Button>
        <Button onClick={() => addTrail('UTC')}>Add trail for today </Button>
      </Group>

      <DatePickerInput
        leftSection={<CalendarIcon size={IconSize.sm} />}
        leftSectionPointerEvents={'none'}
        label={'Choose date'}
        placeholder={'01/01/2001'}
        value={trailDate}
        onChange={setTrailDate}
        my={'md'}
      />
      <Button
        disabled={trailDate === null}
        leftSection={'+'}
        onClick={() => {
          if (trailDate) {
            addTrail(trailDate.toISOString());
          }
        }}
      >
        Add Trail
      </Button>

      <Group my={'xl'}>
        <Title order={3}>Added Sun Trails</Title>
        <Button size={'compact-md'} onClick={() => openspace?.fadeOut('{sun_trail}')}>
          Hide All
        </Button>
      </Group>
      {addedTrails.length === 0 ? (
        <Text>No sun trails</Text>
      ) : (
        addedTrails.map(
          (trail) =>
            trail && (
              <SceneGraphNodeHeader
                key={trail.identifier}
                uri={sgnUri(trail.identifier)}
              />
            )
        )
      )}
    </>
  );
}
