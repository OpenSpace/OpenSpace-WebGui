import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Image, List, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from '../Tasks/Components/TaskCheckbox';

export function useIntroductionSteps(): React.ReactNode[] {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.introduction'
  });

  const profileName = useAppSelector((state) => state.profile.name);
  const luaApi = useOpenSpaceApi();
  const { setVisibility: setVisibleEsriViirsCombo } = usePropertyOwnerVisibility(
    'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo'
  );

  const isDefaultProfile = profileName === 'Default';

  function setupGettingStartedTour(): void {
    luaApi?.setPropertyValueSingle('RenderEngine.BlackoutFactor', 0.0, 1.0);
    setTimeout(() => {
      luaApi?.action.triggerAction('os.earth_standard_illumination');
      luaApi?.setPropertyValue(
        'Scene.Earth.Renderable.Layers.ColorLayers.*.Enabled',
        false
      );
      setVisibleEsriViirsCombo(true);
      luaApi?.time.setPause(false);
      luaApi?.time.interpolateDeltaTime(1);
      luaApi?.fadeIn('Scene.EarthTrail.Renderable');
      luaApi?.setPropertyValue(
        'Scene.Mars.Renderable.Layers.ColorLayers.CTX_Mosaic_Sweden.Enabled',
        false
      );
      luaApi?.fadeOut('Scene.Constellations.Renderable');
      luaApi?.navigation.jumpTo('Earth');
    }, 1000);
  }

  return [
    <Stack align={'center'}>
      <Image
        src={`${import.meta.env.BASE_URL}/images/openspace-logo.png`}
        h={180}
        fit={'contain'}
        my={'lg'}
      />
      <Text size={'lg'} ta={'center'}>
        {t('welcome')}
      </Text>
    </Stack>,
    <>
      <Text>{t('topics.intro')}:</Text>
      <List>
        <List.Item>{t('topics.sections.navigation')}</List.Item>
        <List.Item>{t('topics.sections.time')}</List.Item>
        <List.Item>{t('topics.sections.content')}</List.Item>
      </List>
    </>,
    <>
      <Text>{t('about-tasks.intro')}</Text>
      <TaskCheckbox taskCompleted={false} label={t('about-tasks.task-label-example')} />
      <TaskCheckbox taskCompleted={true} label={t('about-tasks.task-label-complete')} />
    </>,
    <>
      <Text>{t('lets-go')}</Text>
      <Button size={'md'} mx={'auto'} my={'xs'} onClick={setupGettingStartedTour}>
        {t('setup-tour')}
      </Button>
      {!isDefaultProfile && (
        <Alert
          variant={'light'}
          color={'orange'}
          title={t('other-profile-warning.title')}
        >
          <Text>{t('other-profile-warning.description')}</Text>
        </Alert>
      )}
    </>
  ];
}
