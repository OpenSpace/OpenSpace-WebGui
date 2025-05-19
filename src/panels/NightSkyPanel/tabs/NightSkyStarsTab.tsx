import { Alert, Button, Divider, Group, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { useProperty } from '@/hooks/properties';

export function NightSkyStarsTab() {
  const luaApi = useOpenSpaceApi();

  const [starsDimInAtm, setStarsDimInAtm] = useProperty(
    'BoolProperty',
    'Scene.Stars.Renderable.DimInAtmosphere'
  );

  return (
    <>
      <Group my={'md'}>
        <Title order={2}>Visibility</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox uri={'Scene.Stars.Renderable'} />
          <Text>Show Stars</Text>
          <BoolInput
            label={'Show During day'}
            info={'Check this box to show the stars during the daytime'}
            value={!starsDimInAtm || false}
            onChange={() => setStarsDimInAtm(!starsDimInAtm)}
          />
        </Group>
      </Group>
      <Group>
        <Title order={2}>Labels</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox uri={'Scene.StarsLabels.Renderable'} />
          <Text>Show Labels</Text>
          <PropertyOwnerVisibilityCheckbox uri={'Scene.StarLabelsAlternate.Renderable'} />
          <Text>Show Alternate Labels</Text>
        </Group>
      </Group>
      <Divider my={'md'}></Divider>
      <Group my={'xl'}>
        <Alert variant={'outline'} title={'Note'} color={'dark'} p={'xl'} mb={'md'}>
          The buttons below only work in the 'nightsky' profile. Use the profile editor to
          edit the actions and ajust the values for your dome.
        </Alert>
        <Title order={2}>Appearance</Title>
        <Group gap={'xs'}>
          <Button
            onClick={() => luaApi?.action.triggerAction('os.nightsky.DefaultStars')}
          >
            Default settings
          </Button>
          <Button
            onClick={() => luaApi?.action.triggerAction('os.nightsky.PointlikeStars')}
          >
            More point like stars
          </Button>
        </Group>
      </Group>
    </>
  );
}
