import { Button, Group, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { useProperty } from '@/hooks/properties';

export function NightSkySolarSystemTab() {
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

  return (
    <>
      <Title order={2} my={'md'}> Trails </Title>
      <Group mb={'md'}>
        <Button
          onClick={() => {
            action('os.FadeDownTrails');
          }}
        >
          Hide ALL Trails
        </Button>
        <Button
          onClick={() => {
            luaApi?.fadeIn('{planetTrail_solarSystem}');
            luaApi?.fadeOut('Scene.EarthTrail.Renderable');
          }}
        >
          Show Planet Trails
        </Button>
      </Group>

      <Title order={2} my={'md'}> Labels </Title>
      <Group gap={'xs'}>
        <Button onClick={() => luaApi?.fadeIn('{solarsystem_labels}.Renderable')}>
          Show Labels
        </Button>
        <Button onClick={() => luaApi?.fadeOut('{solarsystem_labels}.Renderable')}>
          Hide Labels
        </Button>
      </Group>

      <Title order={2} my={'md'}> Planets </Title>
      <Group gap={'xs'}>
        <Button onClick={() => action('os.nightsky.ShowNightSkyPlanets')}>
          Show Night Sky Planets
        </Button>
        <Button onClick={() => action('os.nightsky.HideNightSkyPlanets')}>
          Hide Night Sky Planets
        </Button>
      </Group>

      <Title order={2} my={'md'}> Moon </Title>
      <Group gap={'xs'}>
        {moonScale !== undefined ? (
          <>
              <Button onClick={() => setMoonScale(1.0)}>Default Scale Moon (1x)</Button>
              <Button onClick={() => setMoonScale(2.0)}>Enlarge Moon (2x)</Button>
              <Button onClick={() => setMoonScale(4.0)}>Enlarge Moon (4x)</Button>
              <Button onClick={() => setMoonScale(moonScale + 0.5)}>+</Button>
              <Button onClick={() => setMoonScale(moonScale - 0.5)}>-</Button>
          </>
        ): (
          <Text>Could not find Moon scale settings</Text>
        )}
        {performShading !== undefined ? (
          <>
            <BoolInput
            label={'Show Phase'}
            info={'Uncheck this to show the full moon always. This is equivalent to the "Perform Shading" property on the Moon.'}
            value={performShading || false} onChange={setPerformShading} />
          </>
        ): (
          <Text>Could not find Moon Perform Shading settings</Text>
        )}
      </Group>
    </>
  );
}
