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
    luaApi?.action.triggerAction(`os.nightsky.Looking'${direction}`);
  }

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Group mb={'md'} justify={'space-between'} align={'top'}>
        <Stack gap={5}>
          <Title order={2} mb={'xs'}>
            Globe Location
          </Title>
          <Text size={'md'}>Latitude: {currentLat?.toFixed(2)}</Text>
          <Text size={'md'}>Longitude: {currentLong?.toFixed(2)}</Text>
          <Text size={'md'}>Altitude: {currentAlt?.toFixed(2)}m</Text>
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
            <Alert w={'100%'} title={'Warning!'} icon={<WarningIcon />}>
              <Text>{`You are not on Earth, but on ${anchor?.name}.`}</Text>
            </Alert>
          </div>
        )}
      </Transition>

      <Divider my={'xs'} mt={5} />
      <Title order={2} mb={'xs'}>
        Jump to Position
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.NorthPole')}
        >
          North Pole
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.Equator')}
        >
          Equator
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.position.SouthPole')}
        >
          South Pole
        </Button>
      </Group>
      <Paper>
        <Alert mt={'md'} p={'sm'} variant={'subtle'} icon={<LocationPinIcon />}>
          <Text size={'sm'}>
            To search for a specific location on Earth, use the Geo Location window.
          </Text>
        </Alert>
      </Paper>
      <Divider my={'sm'} />

      <Title order={2} mb={'xs'}>
        Direction
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => look('North')}>Look North</Button>
        <Button onClick={() => look('East')}>Look East</Button>
        <Button onClick={() => look('South')}>Look South</Button>
        <Button onClick={() => look('West')}>Look West</Button>
      </Group>
      <Title order={2} mt={'sm'} mb={'xs'}>
        Horizon
      </Title>

      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.LevelHorizonPitch')}
        >
          Look at Horizon
        </Button>
        <Button
          onClick={() => luaApi.action.triggerAction('os.nightsky.LevelHorizonYaw')}
        >
          Level Horizon
        </Button>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.LookUp')}>
          Look Up
        </Button>
      </Group>
    </>
  );
}
