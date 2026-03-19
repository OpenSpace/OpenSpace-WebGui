import { useTranslation } from 'react-i18next';
import { Box, Button, Group, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import {
  AbcIcon,
  BandIcon,
  EyeOffIcon,
  GridSphereIcon,
  LineIcon,
  PaintBrushIcon,
  PencilIcon,
  SingleDotIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { CardinalDirectionsBoxes } from './CardinalDirectionsBoxes';
import { ConstellationsShowArtBox } from './ConstellationsShowArtBox';
import { ConstellationsShowLabelsBox } from './ConstellationsShowLabelsBox';
import { ConstellationShowLinesBox } from './ConstellationsShowLinesBox';
import { SceneGraphNodeBox } from './SceneGraphNodeBox';

export function MarkingsTab() {
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'markings' });

  const luaApi = useOpenSpaceApi();

  return (
    <Box maw={600}>
      {luaApi ? (
        <Button
          leftSection={<EyeOffIcon />}
          onClick={() => luaApi.action.triggerAction('os.nightsky.HideAllMarkings')}
        >
          {t('common-button-labels.hide-all')}
        </Button>
      ) : (
        <LoadingBlocks n={1} />
      )}
      <Title order={2} my={'sm'}>
        {t('altitude-azimuth.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.sm} />}
          identifier={'AltAzGrid'}
        />
        <SceneGraphNodeBox
          title={t('altitude-azimuth.buttons.meridian')}
          icon={<LineIcon size={IconSize.sm} />}
          identifier={'MeridianPlane'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.sm} />}
          identifier={'AltAzGridLabels'}
        />
        <SceneGraphNodeBox
          title={t('altitude-azimuth.buttons.zenith')}
          icon={<SingleDotIcon size={IconSize.sm} />}
          identifier={'ZenithDot'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('ecliptic.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.sm} />}
          identifier={'EclipticSphere'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.line_one')}
          icon={<LineIcon size={IconSize.sm} />}
          identifier={'EclipticLine'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.sm} />}
          identifier={'EclipticSphereLabels'}
        />
        <SceneGraphNodeBox
          title={t('ecliptic.buttons.band')}
          icon={<BandIcon size={IconSize.sm} />}
          identifier={'EclipticBand'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('equatorial.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.sm} />}
          identifier={'EquatorialSphere'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.line_one')}
          icon={<LineIcon size={IconSize.sm} />}
          identifier={'EquatorialLine'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.sm} />}
          identifier={'EquatorialSphereLabels'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('constellations.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.sm} />}
          identifier={'ConstellationBounds'}
        />
        <ConstellationShowLinesBox
          title={t('common-button-labels.line_other')}
          icon={<PencilIcon size={IconSize.sm} />}
        />
        <ConstellationsShowArtBox
          title={t('constellations.buttons.art')}
          icon={<PaintBrushIcon size={IconSize.sm} />}
        />
        <ConstellationsShowLabelsBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.sm} />}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('cardinal-directions.title')}
      </Title>
      <CardinalDirectionsBoxes />
    </Box>
  );
}
