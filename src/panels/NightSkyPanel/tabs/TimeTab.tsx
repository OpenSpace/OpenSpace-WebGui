import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import * as GeoTZ from 'browser-geo-tz';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so loaving for now

export function TimeTab() {
  const [lastLat, setLastLat] = useState<number>(0);
  const [lastLong, setLastong] = useState<number>(0);
  const [localArea, setLocalArea] = useState<string>('UTC');

  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );

  const luaApi = useOpenSpaceApi();
  const timeCapped = useSubscribeToTime();

  const date = useMemo(() => new Date(timeCapped ?? ''), [timeCapped]);
  const isValidDate = isDateValid(date);

  useEffect(() => {
    async function getAreas(lat: number, lon: number): Promise<string[]> {
      return await GeoTZ.find(lat, lon);
    }
    if (currentLat !== undefined && currentLong !== undefined) {
      const dLat = Math.abs(currentLat - lastLat);
      const dLon = Math.abs(currentLong - lastLong);

      if (dLat + dLon < 1) {
        return;
      }

      setLastLat(currentLat);
      setLastong(currentLong);
      getAreas(currentLat, currentLong).then((value) => setLocalArea(value[0]));
    }
  }, [currentLat, currentLong, lastLat, lastLong]);

  function localTimeString(): string {
    let str = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      timeZone: localArea
    });
    str += ' ' + date.toLocaleTimeString('en-US', { timeZone: localArea });
    return str;
  }

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Group justify={'space-between'} align={'top'} gap={'xs'} mb={'md'}>
        <Title order={2} size={'xl'}>
          Simulation Time
        </Title>
        <Button
          onClick={async () => {
            const now = await luaApi.time.currentWallTime();
            if (now) {
              luaApi?.time.setTime(now);
            } else {
              const ceftime = new Date().toUTCString();
              luaApi?.time.setTime(ceftime);
            }
          }}
        >
          Set to now
        </Button>
      </Group>
      <Text size={'lg'} fw={'bold'}>
        Local: {localTimeString()}
      </Text>
      <Text mb={'lg'}>Timezone: {localArea}</Text>
      <Text my={'md'}>UTC: {isValidDate ? date.toUTCString() : 'Date out of range'}</Text>
      <Divider />
      <Title order={3} my={'xs'}>
        Jumps
      </Title>
      <Stack>
        <Group gap={'lg'}>
          <Group gap={'xs'}>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.siderealDayIncrease')}
            >
              + Sidereal day
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.siderealDayDecrease')}
            >
              - Sidereal day
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.siderealWeekIncrease')}
            >
              + Sidereal week
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.siderealWeekDecrease')}
            >
              - Sidereal week
            </Button>
          </Group>
          <Group gap={'xs'}>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.SolarDayIncrease')}
            >
              + Solar day
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.SolarDayDecrease')}
            >
              - Solar day
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.SolarWeekIncrease')}
            >
              + Solar week
            </Button>
            <Button
              onClick={() => luaApi.action.triggerAction('os.time.SolarWeekDecrease')}
            >
              - solar week
            </Button>
          </Group>
        </Group>
        <Divider />
        <Title order={3}>Diurnal Motion</Title>
        <Group gap={'xs'}>
          <Button
            onClick={() => {
              luaApi.time.interpolatePause(false);
              luaApi.time.interpolateDeltaTime(1);
            }}
          >
            Realtime
          </Button>
          <Button
            onClick={() => {
              luaApi.time.interpolatePause(false);
              luaApi.time.interpolateDeltaTime(60);
            }}
          >
            60x (1 min/sec)
          </Button>
          <Button
            onClick={() => {
              luaApi.time.interpolatePause(false);
              luaApi.time.interpolateDeltaTime(120);
            }}
          >
            120x (2 min/sec)
          </Button>
          <Button
            onClick={() => {
              luaApi.time.interpolatePause(false);
              luaApi.time.interpolateDeltaTime(300);
            }}
          >
            300x (5 min/sec)
          </Button>

          <Button onClick={() => luaApi.time.togglePause()}>Play / Pause</Button>
        </Group>
      </Stack>
      <Divider my={'xs'} />
      <Alert title={'Note'}>
        <Text>
          Only some controls are found here. For more control over time, use the Time
          Panel.
        </Text>
      </Alert>
    </>
  );
}
