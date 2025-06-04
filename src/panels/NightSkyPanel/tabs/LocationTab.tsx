import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackgroundImage,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  Transition
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { LocationPinIcon, WarningIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { LookDirection } from '../types';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function LocationTab() {
  const {
    latitude: currentLat,
    longitude: currentLong,
    altitude: currentAlt
  } = useAppSelector((state) => state.camera);

  const luaApi = useOpenSpaceApi();
  useSubscribeToCamera();

  const anchor = useAnchorNode();
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'location' });

  const iconSize = 10;
  const mapSize = { w: 300, h: 150 };
  const iconOffset = {
    x: (iconSize + 4) / (2 * mapSize.w),
    y: iconSize / (2 * mapSize.h)
  };

  function dotPosition(): { x: number; y: number } {
    if (currentLong !== undefined && currentLat !== undefined) {
      // Here we are getting the percentage of the map on where to show the marker
      // for example, lat, long of 0,0 winds up with a map position of x: 0.5 and y: 0.5
      return {
        x: ((currentLong + 180) / 360 - iconOffset.x) * 100,
        y: ((90 - currentLat) / 180 - iconOffset.y) * 100
      };
    }
    return { x: 0, y: 0 };
  }

  function look(direction: LookDirection): void {
    luaApi?.action.triggerAction(`os.nightsky.Looking${direction}`);
  }

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Group mb={'md'} justify={'space-between'} align={'top'}>
        <Stack gap={5}>
          <Title order={2} mb={'xs'}>
            {t('globe-location.title')}
          </Title>
          <Text size={'md'}>
            {t('globe-location.latitude')}: {currentLat?.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.longitude')}: {currentLong?.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.altitude')}: {currentAlt?.toFixed(2)}
            {t('globe-location.meter-abbreviation')}
          </Text>
        </Stack>

        <BackgroundImage
          w={mapSize.w}
          h={mapSize.h}
          src={'eqcy.png'}
          radius={'sm'}
          styles={{ root: { overflow: 'hidden' } }}
        >
          <Image
            src={'icon.png'}
            style={{
              width: iconSize + 'px',
              position: 'relative',
              left: dotPosition().x + '%',
              top: dotPosition().y + '%'
            }}
          />
        </BackgroundImage>
      </Group>
      <Transition mounted={anchor?.identifier !== 'Earth'} transition={'fade'}>
        {(styles) => (
          <div style={styles}>
            <Alert
              w={'100%'}
              title={t('globe-location.warning.title')}
              icon={<WarningIcon />}
            >
              <Text>
                {t('globe-location.warning.description', { name: anchor?.name })}
              </Text>
            </Alert>
          </div>
        )}
      </Transition>

      <Divider my={'xs'} mt={5} />
      <Title order={2} mb={'xs'}>
        {t('jump-to-position.title')}
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.NorthPole')}
        >
          {t('jump-to-position.north-pole')}
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.Equator')}
        >
          {t('jump-to-position.equator')}
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.SouthPole')}
        >
          {t('jump-to-position.south-pole')}
        </Button>
      </Group>
      <Paper>
        <Alert mt={'md'} p={'sm'} variant={'subtle'} icon={<LocationPinIcon />}>
          <Text size={'sm'}>{t('jump-to-position.tooltip')}</Text>
        </Alert>
      </Paper>
      <Divider my={'sm'} />

      <Title order={2} mb={'xs'}>
        {t('direction.title')}
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => look('North')}>{t('direction.look-north')}</Button>
        <Button onClick={() => look('East')}>{t('direction.look-east')}</Button>
        <Button onClick={() => look('South')}>{t('direction.look-south')}</Button>
        <Button onClick={() => look('West')}>{t('direction.look-west')}</Button>
      </Group>
      <Title order={2} mt={'sm'} mb={'xs'}>
        {t('horizon.title')}
      </Title>

      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.LevelHorizonPitch')}
        >
          {t('horizon.look-horizion')}
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.LevelHorizonYaw')}
        >
          {t('horizon.level-horizon')}
        </Button>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.LookUp')}>
          {t('horizon.look-up')}
        </Button>
      </Group>
    </>
  );
}
