import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { CalendarIcon, EyeIcon, EyeOffIcon, MinusIcon, PlusIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

export function SunTab() {
  const [trailDate, setTrailDate] = useState<Date | null>(null);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const [angularSize, setAngularSize] = useProperty(
    'FloatProperty',
    'Scene.EarthAtmosphere.Renderable.SunAngularSize'
  );

  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'sun' });
  const sunTrailTag = 'sun_trail';

  const addedTrails = Object.values(propertyOwners).filter((owner) =>
    owner!.tags.includes(sunTrailTag)
  );

  function addTrail(date: string): void {
    luaApi?.action.triggerAction('os.nightsky.AddSunTrail', { Date: date });
  }

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Title order={2} mb={'xs'}>
        {t('glare.title')}
      </Title>
      <Group gap={'xs'}>
        <Button
          onClick={() => luaApi.fadeIn('Scene.SunGlare.Renderable')}
          leftSection={<EyeIcon />}
        >
          {t('glare.buttons.show-glare')}
        </Button>
        <Button
          onClick={() => luaApi.fadeOut('Scene.SunGlare.Renderable')}
          leftSection={<EyeOffIcon />}
        >
          {t('glare.buttons.hide-glare')}
        </Button>
      </Group>
      <Title order={2} mt={'md'} mb={'xs'}>
        {t('size.title')}
      </Title>
      {angularSize !== undefined ? (
        <Group gap={'xs'}>
          <Button onClick={() => setAngularSize(0.3)}>
            {t('size.buttons.default-size')}
          </Button>
          <Button onClick={() => setAngularSize(0.6)}>
            {t('size.buttons.large-size')}
          </Button>
          <Button onClick={() => setAngularSize(0.8)}>
            {t('size.buttons.extra-large-size')}
          </Button>
          <ActionIcon
            onClick={() => setAngularSize(angularSize + 0.1)}
            size={'lg'}
            aria-label={t('size.aria-labels.increase-size')}
          >
            <PlusIcon />
          </ActionIcon>
          <ActionIcon
            onClick={() => setAngularSize(angularSize - 0.1)}
            size={'lg'}
            aria-label={t('size.aria-labels.decrease-size')}
          >
            <MinusIcon />
          </ActionIcon>
        </Group>
      ) : (
        <>
          <Text>{t('size.error')}</Text>
        </>
      )}

      <Divider my={'sm'} />
      <Title order={2} mb={'xs'}>
        {t('trails.title')}
      </Title>
      <Group gap={'xs'}>
        <Button onClick={() => addTrail('NOW')} leftSection={<PlusIcon />}>
          {t('trails.buttons.add-trail-simulation-date')}
        </Button>
        <Button onClick={() => addTrail('UTC')} leftSection={<PlusIcon />}>
          {t('trails.buttons.add-trail-today')}
        </Button>
      </Group>

      <DatePickerInput
        leftSection={<CalendarIcon size={IconSize.sm} />}
        leftSectionPointerEvents={'none'}
        label={t('trails.choose-date')}
        placeholder={'01/01/2001'}
        value={trailDate}
        onChange={setTrailDate}
        mt={'sm'}
      />
      <Button
        disabled={trailDate === null}
        leftSection={<PlusIcon />}
        onClick={() => trailDate && addTrail(trailDate.toISOString())}
        mt={'xs'}
      >
        {t('trails.buttons.add-trail')}
      </Button>

      <Group mt={'md'} mb={'xs'}>
        <Title order={3}>{t('trails.added-trails.title')}</Title>
        <Button size={'compact-md'} onClick={() => luaApi.fadeOut(`{${sunTrailTag}}`)}>
          {t('trails.buttons.hide-trails')}
        </Button>
      </Group>
      <Paper p={'sm'}>
        {addedTrails.length === 0 ? (
          <Text>{t('trails.added-trails.no-trails')}</Text>
        ) : (
          <Stack gap={'xs'}>
            {addedTrails.map(
              (trail) =>
                trail && (
                  <SceneGraphNodeHeader
                    key={trail.identifier}
                    uri={sgnUri(trail.identifier)}
                  />
                )
            )}
          </Stack>
        )}
      </Paper>
    </>
  );
}
