import { Alert, Button, Divider, Group, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { useProperty } from '@/hooks/properties';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function StarsTab() {
  const luaApi = useOpenSpaceApi();

  const [starsDimInAtm, setStarsDimInAtm] = useProperty(
    'BoolProperty',
    'Scene.Stars.Renderable.DimInAtmosphere'
  );

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Group mb={'sm'}>
        <Title order={2}>Visibility</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.Stars.Renderable'}
            label={'Show Stars'}
          />
          <BoolInput
            label={'Show During day'}
            info={'Check this box to show the stars during daytime'}
            value={!starsDimInAtm || false}
            onChange={() => setStarsDimInAtm(!starsDimInAtm)}
          />
        </Group>
      </Group>
      <Group>
        <Title order={2}>Labels</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.StarsLabels.Renderable'}
            label={'Show Labels'}
          />
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.StarLabelsAlternate.Renderable'}
            label={'Show Alternate Labels'}
          />
        </Group>
      </Group>
      <Divider my={'md'} />
      <Group>
        <Title order={2}>Appearance</Title>
        <Alert title={'Only Night Sky Profile'}>
          The buttons below only work in the 'nightsky' profile. Use the profile editor to
          edit the actions and adjust the values for your dome.
        </Alert>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.DefaultStars')}>
          Default settings
        </Button>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.PointlikeStars')}>
          More point like stars
        </Button>
      </Group>
    </>
  );
}
