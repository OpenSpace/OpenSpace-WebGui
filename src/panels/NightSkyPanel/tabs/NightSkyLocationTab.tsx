import {
  BackgroundImage,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { LocationPinIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

export function NightSkyLocationTab() {
  const luaApi = useOpenSpaceApi();
  useSubscribeToCamera();

  const {
    latitude: currentLat,
    longitude: currentLong,
    altitude: currentAlt
  } = useAppSelector((state) => {
    return state.camera;
  });

  function dotPosition() {
    if (currentLong && currentLat) {
      return { x: ((currentLong + 180) / 360) * 100, y: ((90 - currentLat) / 180) * 100 };
    } else {
      return { x: 0, y: 0 };
    }
  }

  function look(direction: string): void {
    luaApi?.action.triggerAction('os.nightsky.Looking' + direction);
  }

  return (
    <>
      <Group justify={'center'}>
        <Text size={'md'}>
          Globe position - Latitude: {currentLat?.toFixed(2)}, Longitude:{' '}
          {currentLong?.toFixed(2)}, Altitude: {currentAlt?.toFixed(2)}m
        </Text>
        <BackgroundImage w={300} h={150} src={'eqcy.png'}>
          <Image
            src={'icon.png'}
            style={{
              width: '10px',
              position: 'relative',
              left: dotPosition().x - 0.1666666666 + '%',
              top: dotPosition().y - 0.1666666666 + '%'
            }}
          ></Image>
        </BackgroundImage>
      </Group>
      <Divider my={'xl'} mt={5} />
      <Group>
        <Text size={'xl'}>Jump to Positon</Text>
        <Stack>
          <Group>
            <Button
              onClick={() => {
                luaApi?.action.triggerAction('os.nightsky.position.NorthPole');
              }}
            >
              North Pole
            </Button>
            <Button
              onClick={() => {
                luaApi?.action.triggerAction('os.nightsky.position.Equator');
              }}
            >
              Equator
            </Button>
            <Button
              onClick={() => {
                luaApi?.action.triggerAction('os.nightsky.position.SouthPole');
              }}
            >
              South Pole
            </Button>
          </Group>
        </Stack>
      </Group>
      <Paper shadow={'xs'} p={'xl'} my={'xl'}>
        <Text>
          To search for a particular location on Earth, use the Geo Location window.
          <LocationPinIcon size={20}></LocationPinIcon>
        </Text>
      </Paper>
      <Divider mt={5} />
      <Text my={'md'} size={'xl'}>
        Direction
      </Text>
      <Group my={'md'}>
        <Button
          onClick={() => {
            look('North');
          }}
        >
          Look North
        </Button>
        <Button
          onClick={() => {
            look('East');
          }}
        >
          Look East
        </Button>
        <Button
          onClick={() => {
            look('South');
          }}
        >
          Look South
        </Button>
        <Button
          onClick={() => {
            look('West');
          }}
        >
          Look West
        </Button>
      </Group>
      <Text size={'xl'}>Horizon</Text>
      <Group my={'md'}>
        <Button
          onClick={() => {
            luaApi?.action.triggerAction('os.nightsky.LevelHorizonPitch');
          }}
        >
          Look at Horizon
        </Button>
        <Button
          onClick={() => {
            luaApi?.action.triggerAction('os.nightsky.LevelHorizonYaw');
          }}
        >
          Level Horizon
        </Button>
        <Button
          onClick={() => {
            luaApi?.action.triggerAction('os.nightsky.LookUp');
          }}
        >
          Look Up
        </Button>
      </Group>
    </>
  );
}
