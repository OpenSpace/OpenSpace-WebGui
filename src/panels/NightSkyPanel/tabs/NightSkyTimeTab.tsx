import { useEffect, useState } from 'react';
import { Button, Divider, Group, Paper, Stack, Text } from '@mantine/core';
import * as GeoTZ from 'browser-geo-tz';

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

export function NightSkyTimeTab() {
  const luaApi = useOpenSpaceApi();
  const timeCapped = useSubscribeToTime();

  const { latitude: currentLat, longitude: currentLong } = useAppSelector((state) => {
    return state.camera;
  });

  const [lastLat, setLastLat] = useState<number>(0);
  const [lastLong, setLastong] = useState<number>(0);
  const [localArea, setLocalArea] = useState<string>('UTC');
  const [localTimeString, setLocalTimeString] = useState<string>('UTC');

  const date = new Date(timeCapped ?? '');
  const isValidDate = isDateValid(date);
  const timeLabel = isValidDate ? date.toUTCString() : 'Date out of range';

  async function getAreas(lat: number, lon: number): Promise<string[]> {
    return await GeoTZ.find(lat, lon);
  }

  function getLocalTime(): string {
    let str = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      timeZone: localArea as string
    });
    str += ' ' + date.toLocaleTimeString('en-US', { timeZone: localArea as string });
    return str;
  }

  useEffect(() => {
    setLocalTimeString(getLocalTime());
  }, [date]);

  useEffect(() => {
    if (currentLat && currentLong) {
      const dLat = Math.abs(currentLat - lastLat);
      const dLon = Math.abs(currentLong - lastLong);

      if (dLat + dLon < 1) {
        return;
      }

      setLastLat(currentLat);
      setLastong(currentLong);

      getAreas(currentLat, currentLong).then((value) => {
        setLocalArea(value[0]);
        setLocalTimeString(getLocalTime());
      });
    }
  }, [currentLat, currentLong]);

  return (
    <>
      <Group mb={'md'}>
        <Text my={'md'} size={'xl'}>
          Simulation Time
        </Text>
        <Button
          onClick={async () => {
            const now = await luaApi?.time.currentWallTime();
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
      <Text size={'xl'} style={{ flexGrow: 12 }}>
        Local: {localTimeString}
      </Text>
      <Text mb={'lg'} style={{ flexGrow: 12 }}>
        Timezone: {localArea}
      </Text>
      <Text my={'md'} style={{ flexGrow: 12 }}>
        UTC: {timeLabel}
      </Text>
      <Divider mt={5} />
      <Text my={'md'} size={'xl'}>
        Jumps
      </Text>
      <Stack mb={'lg'}>
        <Group gap={'xl'}>
          <Group>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.siderealDayIncrease')}
            >
              + sidereal day
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.siderealDayDecrease')}
            >
              - sidereal day
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.siderealWeekIncrease')}
            >
              + sidereal week
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.siderealWeekDecrease')}
            >
              - sidereal week
            </Button>
          </Group>
          <Group>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.SolarDayIncrease')}
            >
              + solar day
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.SolarDayDecrease')}
            >
              - solar day
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.SolarWeekIncrease')}
            >
              + solar week
            </Button>
            <Button
              onClick={() => luaApi?.action.triggerAction('os.time.SolarWeekDecrease')}
            >
              - solar week
            </Button>
          </Group>
        </Group>
        <Divider mt={5} />
        <Text size={'xl'}>Diurnal Motion</Text>
        <Group>
          <Button
            onClick={() => {
              luaApi?.time.interpolatePause(false);
              luaApi?.time.interpolateDeltaTime(1);
            }}
          >
            Realtime
          </Button>
          <Button
            onClick={() => {
              luaApi?.time.interpolatePause(false);
              luaApi?.time.interpolateDeltaTime(60);
            }}
          >
            60x (1 min/sec)
          </Button>
          <Button
            onClick={() => {
              luaApi?.time.interpolatePause(false);
              luaApi?.time.interpolateDeltaTime(120);
            }}
          >
            120x (2 min/sec)
          </Button>
          <Button
            onClick={() => {
              luaApi?.time.interpolatePause(false);
              luaApi?.time.interpolateDeltaTime(300);
            }}
          >
            300x (5 min/sec)
          </Button>

          <Button onClick={() => luaApi?.time.togglePause()}>Play / Pause</Button>
        </Group>
      </Stack>
      <Divider mt={5} />
      <Paper my={'lg'} shadow={'xs'} p={'xl'}>
        <Text>
          Only some controls are found here. For more control over time, use the Time
          Panel.
        </Text>
      </Paper>
    </>
  );
}
