import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Divider, Group, Paper, Text, Title } from '@mantine/core';
import * as GeoTZ from 'browser-geo-tz';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { PlusMinusActionGroup } from '@/components/PlusMinusActionGroup/PlusMinusActionGroup';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { CalendarIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function TimeTab() {
  const [lastLat, setLastLat] = useState<number>(0);
  const [lastLong, setLastong] = useState<number>(0);
  const [localArea, setLocalArea] = useState<string>('UTC');

  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );

  const luaApi = useOpenSpaceApi();
  const timeCapped = useSubscribeToTime();
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'time' });

  const date = new Date(timeCapped ?? '');
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
          {t('simulation-time.title')}
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
          {t('simulation-time.buttons.set-now')}
        </Button>
      </Group>
      <Text size={'lg'} fw={'bold'}>
        {t('simulation-time.local')}: {localTimeString()}
      </Text>
      <Text mb={'lg'}>
        {t('simulation-time.timezone')}: {localArea}
      </Text>
      <Text my={'md'}>
        {t('simulation-time.utc')}:{' '}
        {isValidDate ? date.toUTCString() : t('simulation-time.error')}
      </Text>
      <Divider />
      <Title order={3} mt={'sm'} mb={'xs'}>
        {t('jumps.title')}
      </Title>
      <Group gap={'lg'}>
        <Group gap={'xs'}>
          <PlusMinusActionGroup
            minusLabel={t('jumps.buttons.sidereal-day.decrease-tooltip')}
            plusLabel={t('jumps.buttons.sidereal-day.increase-tooltip')}
            centerLabel={t('jumps.buttons.sidereal-day.title')}
            onClickMinus={() =>
              luaApi.action.triggerAction('os.time.siderealDayDecrease')
            }
            onClickPlus={() => luaApi.action.triggerAction('os.time.siderealDayIncrease')}
          />

          <PlusMinusActionGroup
            minusLabel={t('jumps.buttons.sidereal-week.decrease-tooltip')}
            plusLabel={t('jumps.buttons.solar-week.increase-tooltip')}
            centerLabel={t('jumps.buttons.sidereal-week.title')}
            onClickMinus={() =>
              luaApi.action.triggerAction('os.time.siderealWeekDecrease')
            }
            onClickPlus={() =>
              luaApi.action.triggerAction('os.time.siderealWeekIncrease')
            }
          />
        </Group>
        <Group gap={'xs'}>
          <PlusMinusActionGroup
            minusLabel={t('jumps.buttons.solar-day.decrease-tooltip')}
            plusLabel={t('jumps.buttons.solar-day.increase-tooltip')}
            centerLabel={t('jumps.buttons.solar-day.title')}
            onClickMinus={() => luaApi.action.triggerAction('os.time.SolarDayDecrease')}
            onClickPlus={() => luaApi.action.triggerAction('os.time.SolarDayIncrease')}
          />

          <PlusMinusActionGroup
            minusLabel={t('jumps.buttons.solar-week.decrease-tooltip')}
            plusLabel={t('jumps.buttons.solar-week.increase-tooltip')}
            centerLabel={t('jumps.buttons.solar-week.title')}
            onClickMinus={() => luaApi.action.triggerAction('os.time.SolarWeekDecrease')}
            onClickPlus={() => luaApi.action.triggerAction('os.time.SolarWeekIncrease')}
          />
        </Group>
      </Group>
      <Divider mt={'sm'} />
      <Title order={3} mt={'sm'} mb={'xs'}>
        {t('diurnal-motion.title')}
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => {
            luaApi.time.interpolatePause(false);
            luaApi.time.interpolateDeltaTime(1);
          }}
        >
          {t('diurnal-motion.buttons.realtime')}
        </Button>
        <Button
          onClick={() => {
            luaApi.time.interpolatePause(false);
            luaApi.time.interpolateDeltaTime(60);
          }}
        >
          {t('diurnal-motion.buttons.60x')}
        </Button>
        <Button
          onClick={() => {
            luaApi.time.interpolatePause(false);
            luaApi.time.interpolateDeltaTime(120);
          }}
        >
          {t('diurnal-motion.buttons.120x')}
        </Button>
        <Button
          onClick={() => {
            luaApi.time.interpolatePause(false);
            luaApi.time.interpolateDeltaTime(300);
          }}
        >
          {t('diurnal-motion.buttons.300x')}
        </Button>

        <Button onClick={() => luaApi.time.togglePause()}>
          {t('diurnal-motion.buttons.play-pause')}
        </Button>
      </Group>
      <Paper>
        <Alert mt={'md'} variant={'subtle'} p={'sm'} icon={<CalendarIcon />}>
          <Text size={'sm'}>{t('diurnal-motion.tooltip')}</Text>
        </Alert>
      </Paper>
    </>
  );
}
