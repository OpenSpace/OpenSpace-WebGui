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
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'AltAzGrid'}
        />
        <SceneGraphNodeBox
          title={t('altitude-azimuth.buttons.meridian')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'MeridianPlane'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'AltAzGridLabels'}
        />
        <SceneGraphNodeBox
          title={t('altitude-azimuth.buttons.zenith')}
          icon={<SingleDotIcon size={IconSize.md} />}
          identifier={'ZenithDot'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('ecliptic.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EclipticSphere'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.line_one')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EclipticLine'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EclipticSphereLabels'}
        />
        <SceneGraphNodeBox
          title={t('ecliptic.buttons.band')}
          icon={<BandIcon size={IconSize.md} />}
          identifier={'EclipticBand'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('equatorial.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EquatorialSphere'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.line_one')}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EquatorialLine'}
        />
        <SceneGraphNodeBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EquatorialSphereLabels'}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('constellations.title')}
      </Title>
      <Group gap={'xs'}>
        <SceneGraphNodeBox
          title={t('common-button-labels.grid')}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'ConstellationBounds'}
        />
        <ConstellationShowLinesBox
          title={t('common-button-labels.line_other')}
          icon={<PencilIcon size={IconSize.md} />}
        />
        <ConstellationsShowArtBox
          title={t('constellations.buttons.art')}
          icon={<PaintBrushIcon size={IconSize.md} />}
        />
        <ConstellationsShowLabelsBox
          title={t('common-button-labels.labels')}
          icon={<AbcIcon size={IconSize.md} />}
        />
      </Group>

      <Title order={2} my={'sm'}>
        {t('cardinal-directions.title')}
      </Title>
      <Group gap={'xs'}>
        <CardinalDirectionsBoxes />
      </Group>
    </Box>
  );
}
