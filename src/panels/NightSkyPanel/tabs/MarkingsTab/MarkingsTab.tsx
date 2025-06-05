import { useTranslation } from 'react-i18next';
import { Box, Button, SimpleGrid, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import {
  AbcIcon,
  BandIcon,
  CompassLargeIcon,
  CompassMarksIcon,
  CompassSmallIcon,
  EyeOffIcon,
  GridSphereIcon,
  LineIcon,
  PaintBrushIcon,
  PencilIcon,
  SingleDotIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { CardinalDirectionsBox } from './CardinalDirectionsBox';
import { ConstellationsShowArtBox } from './ConstellationsShowArtBox';
import { ConstellationsShowLabelsBox } from './ConstellationsShowLabelsBox';
import { ConstellationShowLinesBox } from './ConstellationsShowLinesBox';
import { NightSkyMarkingBox } from './MarkingBox';

export function MarkingsTab() {
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'markings' });

  return (
    <Box maw={600}>
      {luaApi ? (
        <Button
          leftSection={<EyeOffIcon />}
          onClick={() => luaApi.action.triggerAction('os.nightsky.HideAllMarkings')}
        >
          {t('button-labels.hide-all')}
        </Button>
      ) : (
        <LoadingBlocks n={1} />
      )}
      <Title order={2} my={'sm'}>
        {t('alt-az.title')}
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={t('button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'AltAzGrid'}
        />
        <NightSkyMarkingBox
          title={t('alt-az.buttons.meridian')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'MeridianPlane'}
        />
        <NightSkyMarkingBox
          title={t('button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'AltAzGridLabels'}
        />
        <NightSkyMarkingBox
          title={t('alt-az.buttons.zenith')}
          icon={<SingleDotIcon size={IconSize.md} />}
          identifier={'ZenithDot'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        {t('ecliptic.title')}
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={t('button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EclipticSphere'}
        />
        <NightSkyMarkingBox
          title={t('button-labels.line_one')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EclipticLine'}
        />
        <NightSkyMarkingBox
          title={t('button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EclipticSphereLabels'}
        />
        <NightSkyMarkingBox
          title={t('ecliptic.buttons.band')}
          icon={<BandIcon size={IconSize.md} />}
          identifier={'EclipticBand'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        {t('equatorial.title')}
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={t('button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EquatorialSphere'}
        />
        <NightSkyMarkingBox
          title={t('button-labels.line_one')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EquatorialLine'}
        />
        <NightSkyMarkingBox
          title={t('button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EquatorialSphereLabels'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        {t('constellations.title')}
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={t('button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'ConstellationBounds'}
        />
        <ConstellationShowLinesBox
          title={t('button-labels.line_other')}
          icon={<PencilIcon size={IconSize.md} />}
        />
        <ConstellationsShowArtBox
          title={t('constellations.buttons.art')}
          icon={<PaintBrushIcon size={IconSize.md} />}
        />
        <ConstellationsShowLabelsBox
          title={t('button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        {t('cardinal-directions.title')}
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <CardinalDirectionsBox
          variant={'small'}
          title={t('cardinal-directions.buttons.small')}
          icon={<CompassSmallIcon size={IconSize.md} />}
        />
        <CardinalDirectionsBox
          variant={'large'}
          title={t('cardinal-directions.buttons.large')}
          icon={<CompassLargeIcon size={IconSize.md} />}
        />
        <CardinalDirectionsBox
          variant={'marks'}
          title={t('cardinal-directions.buttons.marks')}
          icon={<CompassMarksIcon size={IconSize.md} />}
        />
      </SimpleGrid>
    </Box>
  );
}
