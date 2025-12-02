import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'solar-system' });

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
        {t('trails.title')}
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => action('os.FadeDownTrails')}>
          {t('trails.buttons.hide-trails')}
        </Button>
        <Button
          onClick={() => {
            luaApi.fadeIn('{planetTrail_solarSystem}');
            luaApi.fadeOut('Scene.EarthTrail.Renderable');
          }}
        >
          {t('trails.buttons.show-planet-trails')}
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        {t('labels.title')}
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.fadeIn('{solarsystem_labels}.Renderable')}
          leftSection={<EyeIcon />}
        >
          {t('labels.buttons.show-labels')}
        </Button>
        <Button
          onClick={() => luaApi.fadeOut('{solarsystem_labels}.Renderable')}
          leftSection={<EyeOffIcon />}
        >
          {t('labels.buttons.hide-labels')}
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        {t('planets.title')}
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => action('os.nightsky.ShowNightSkyPlanets')}
          leftSection={<EyeIcon />}
        >
          {t('planets.buttons.show-planets')}
        </Button>
        <Button
          onClick={() => action('os.nightsky.HideNightSkyPlanets')}
          leftSection={<EyeOffIcon />}
        >
          {t('planets.buttons.hide-planets')}
        </Button>
      </Group>

      <Title order={2} mt={'md'} mb={'xs'}>
        {t('moon.title')}
      </Title>
      {moonScale !== undefined ? (
        <Group gap={'xs'}>
          <Button onClick={() => setMoonScale(1.0)}>
            {t('moon.buttons.default-scale')}
          </Button>
          <Button onClick={() => setMoonScale(2.0)}>{t('moon.buttons.2x-scale')}</Button>
          <Button onClick={() => setMoonScale(4.0)}>{t('moon.buttons.4x-scale')}</Button>
          <ActionIcon
            onClick={() => setMoonScale(moonScale + 0.5)}
            size={'lg'}
            aria-label={t('moon.aria-labels.increase-scale')}
          >
            <PlusIcon />
          </ActionIcon>
          <ActionIcon
            onClick={() => setMoonScale(moonScale - 0.5)}
            size={'lg'}
            aria-label={t('moon.aria-labels.decrease-scale')}
          >
            <MinusIcon />
          </ActionIcon>
        </Group>
      ) : (
        <Text>{t('moon.error.moon-scale-settings')}</Text>
      )}

      <Box mt={'md'}>
        {performShading !== undefined ? (
          <BoolInput
            label={t('moon.show-phase-input.title')}
            info={t('moon.show-phase-input.tooltip')}
            value={performShading || false}
            onChange={setPerformShading}
          />
        ) : (
          <Text>{t('moon.error.moon-shading-settings')}</Text>
        )}
      </Box>
    </>
  );
}
