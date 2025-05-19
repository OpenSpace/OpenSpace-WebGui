import {
  BackgroundImage,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { LocationPinIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { LookDirection } from '../types';

export function LocationTab() {
  const luaApi = useOpenSpaceApi();
  useSubscribeToCamera();

  const {
    latitude: currentLat,
    longitude: currentLong,
    altitude: currentAlt
  } = useAppSelector((state) => state.camera);

  function dotPosition(): { x: number; y: number } {
    if (currentLong && currentLat) {
      //here we are getting the percentage of the map on where to show the marker
      //for example, lat, long of 0,0 winds up with a map position of x: 0.5 and y:0.5
      return { x: ((currentLong + 180) / 360) * 100, y: ((90 - currentLat) / 180) * 100 };
    }
    return { x: 0, y: 0 };
  }

  function look(direction: LookDirection): void {
    luaApi?.action.triggerAction('os.nightsky.Looking' + direction);
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

        <BackgroundImage w={300} h={150} src={'eqcy.png'} radius={'sm'}>
          <Image
            src={'icon.png'}
            style={{
              width: '10px',
              position: 'relative',
              left: dotPosition().x - 0.1666666 + '%', //here i was just trying to account for the marker
              top: dotPosition().y - 0.1666666 + '%' //it should be centered instead of top left corner
            }}
          />
        </BackgroundImage>
      </Group>
      <Divider my={'xs'} mt={5} />
      <Group>
        <Title order={2}>Jump to Position</Title>
        <Group gap={'xs'}>
          <Button
            onClick={() => luaApi?.action.triggerAction('os.nightsky.position.NorthPole')}
          >
            North Pole
          </Button>
          <Button
            onClick={() => luaApi?.action.triggerAction('os.nightsky.position.Equator')}
          >
            Equator
          </Button>
          <Button
            onClick={() => luaApi?.action.triggerAction('os.nightsky.position.SouthPole')}
          >
            South Pole
          </Button>
        </Group>
      </Group>
      <Paper p={'sm'} my={'md'}>
        <Text>
          To search for a particular location on Earth, use the Geo Location window.
          <LocationPinIcon size={20}></LocationPinIcon>
        </Text>
      </Paper>
      <Divider my={'xs'} />

      <Title order={2}>Direction</Title>
      <Group my={'md'} gap={'xs'}>
        <Button onClick={() => look('North')}>Look North</Button>
        <Button onClick={() => look('East')}>Look East</Button>
        <Button onClick={() => look('South')}>Look South</Button>
        <Button onClick={() => look('West')}>Look West</Button>
      </Group>
      <Title order={2}>Horizon</Title>

      <Group my={'md'} gap={'xs'}>
        <Button
          onClick={() => luaApi?.action.triggerAction('os.nightsky.LevelHorizonPitch')}
        >
          Look at Horizon
        </Button>
        <Button
          onClick={() => luaApi?.action.triggerAction('os.nightsky.LevelHorizonYaw')}
        >
          Level Horizon
        </Button>
        <Button onClick={() => luaApi?.action.triggerAction('os.nightsky.LookUp')}>
          Look Up
        </Button>
      </Group>
    </>
  );
}
