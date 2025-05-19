import { ActionIcon, Box, Button, Group, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { EyeIcon, EyeOffIcon, MinusIcon, PlusIcon } from '@/icons/icons';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function SolarSystemTab() {
  const luaApi = useOpenSpaceApi();

  const [performShading, setPerformShading] = useProperty(
    'BoolProperty',
    'Scene.Moon.Renderable.PerformShading'
  );
  const [moonScale, setMoonScale] = useProperty(
    'DoubleProperty',
    'Scene.Moon.Scale.Scale'
  );

  function action(identifier: string): void {
    luaApi?.action.triggerAction(identifier);
  }

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Title order={2} mb={'xs'}>
        Trails
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => action('os.FadeDownTrails')}>Hide ALL Trails</Button>
        <Button
          onClick={() => {
            luaApi.fadeIn('{planetTrail_solarSystem}');
            luaApi.fadeOut('Scene.EarthTrail.Renderable');
          }}
        >
          Show Planet Trails
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        Labels
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.fadeIn('{solarsystem_labels}.Renderable')}
          leftSection={<EyeIcon />}
        >
          Show Labels
        </Button>
        <Button
          onClick={() => luaApi.fadeOut('{solarsystem_labels}.Renderable')}
          leftSection={<EyeOffIcon />}
        >
          Hide Labels
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        Planets
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => action('os.nightsky.ShowNightSkyPlanets')}
          leftSection={<EyeIcon />}
        >
          Show Night Sky Planets
        </Button>
        <Button
          onClick={() => action('os.nightsky.HideNightSkyPlanets')}
          leftSection={<EyeOffIcon />}
        >
          Hide Night Sky Planets
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        Moon
      </Title>
      {moonScale !== undefined ? (
        <Group gap={'xs'}>
          <Button onClick={() => setMoonScale(1.0)}>Default Scale Moon (1x)</Button>
          <Button onClick={() => setMoonScale(2.0)}>Enlarge Moon (2x)</Button>
          <Button onClick={() => setMoonScale(4.0)}>Enlarge Moon (4x)</Button>
          <ActionIcon
            onClick={() => setMoonScale(moonScale + 0.5)}
            size={'lg'}
            aria-label={'Increase moon scale'}
          >
            <PlusIcon />
          </ActionIcon>
          <ActionIcon
            onClick={() => setMoonScale(moonScale - 0.5)}
            size={'lg'}
            aria-label={'Deacrease moon scale'}
          >
            <MinusIcon />
          </ActionIcon>
        </Group>
      ) : (
        <Text>Could not find Moon scale settings</Text>
      )}

      <Box mt={'md'}>
        {performShading !== undefined ? (
          <BoolInput
            label={'Show Phase'}
            info={
              'Uncheck this to show the full moon always. This is equivalent to the "Perform Shading" property on the Moon.'
            }
            value={performShading || false}
            onChange={setPerformShading}
          />
        ) : (
          <Text>Could not find Moon Perform Shading settings</Text>
        )}
      </Box>
    </>
  );
}
