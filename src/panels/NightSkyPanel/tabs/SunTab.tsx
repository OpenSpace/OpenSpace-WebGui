import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { CalendarIcon, MinusIcon, PlusIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

export function SunTab() {
  const [trailDate, setTrailDate] = useState<Date | null>(null);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const openspace = useOpenSpaceApi();
  const sunTrailTag = 'sun_trail';

  const addedTrails = Object.values(propertyOwners).filter((owner) =>
    owner!.tags.includes(sunTrailTag)
  );

  const [angularSize, setAngularSize] = useProperty(
    'FloatProperty',
    'Scene.EarthAtmosphere.Renderable.SunAngularSize'
  );

  function addTrail(date: string): void {
    openspace?.action.triggerAction('os.nightsky.AddSunTrail', { Date: date });
  }

  return (
    <>
      <Title order={2} mb={'xs'}>
        Glare
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => openspace?.fadeIn('Scene.SunGlare.Renderable')}>
          Show Glare
        </Button>
        <Button onClick={() => openspace?.fadeOut('Scene.SunGlare.Renderable')}>
          Hide Glare
        </Button>
      </Group>
      <Title order={2} mt={'md'} mb={'xs'}>
        Size
      </Title>
      {angularSize !== undefined ? (
        <Group gap={'xs'}>
          <Button onClick={() => setAngularSize(0.3)}>Default Angular Size</Button>
          <Button onClick={() => setAngularSize(0.6)}>Large Angular Size</Button>
          <Button onClick={() => setAngularSize(0.8)}>Extra Large Angular Size</Button>
          <ActionIcon
            onClick={() => setAngularSize(angularSize + 0.1)}
            size={'lg'}
            aria-label={'Increase angular size'}
          >
            <PlusIcon />
          </ActionIcon>
          <ActionIcon
            onClick={() => setAngularSize(angularSize - 0.1)}
            size={'lg'}
            aria-label={'Decrease angular size'}
          >
            <MinusIcon />
          </ActionIcon>
        </Group>
      ) : (
        <>
          <Text>Could not find Sun Angular Size settings</Text>
        </>
      )}

      <Divider my={'sm'} />
      <Title order={2} mb={'xs'}>
        Trails
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => addTrail('NOW')} leftSection={<PlusIcon />}>
          Add Trail for Simulation Date
        </Button>
        <Button onClick={() => addTrail('UTC')} leftSection={<PlusIcon />}>
          Add Trail for Today
        </Button>
      </Group>

      <DatePickerInput
        leftSection={<CalendarIcon size={IconSize.sm} />}
        leftSectionPointerEvents={'none'}
        label={'Choose date'}
        placeholder={'01/01/2001'}
        value={trailDate}
        onChange={setTrailDate}
        mt={'sm'}
      />
      <Button
        disabled={trailDate === null}
        leftSection={<PlusIcon />}
        onClick={() => trailDate && addTrail(trailDate.toISOString())}
        mt={'xs'}
      >
        Add Trail
      </Button>

      <Group mt={'md'} mb={'xs'}>
        <Title order={3}>Added Sun Trails</Title>
        <Button
          size={'compact-md'}
          onClick={() => openspace?.fadeOut(`{${sunTrailTag}}`)}
        >
          Hide All
        </Button>
      </Group>
      <Paper p={'sm'}>
        {addedTrails.length === 0 ? (
          <Text>No sun trails</Text>
        ) : (
          <Stack gap={'xs'}>
            {addedTrails.map(
              (trail) =>
                trail && (
                  <SceneGraphNodeHeader
                    key={trail.identifier}
                    uri={sgnUri(trail.identifier)}
                  />
                )
            )}
          </Stack>
        )}
      </Paper>
    </>
  );
}
