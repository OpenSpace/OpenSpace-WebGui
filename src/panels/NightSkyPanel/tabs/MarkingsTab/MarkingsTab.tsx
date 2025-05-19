import { Button, SimpleGrid, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  AbcIcon,
  BandIcon,
  CompassLargeIcon,
  CompassMarksIcon,
  CompassSmallIcon,
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
  const openspace = useOpenSpaceApi();

  return (
    <>
      <Button
        w={200}
        onClick={() => openspace?.action.triggerAction('os.nightsky.HideAllMarkings')}
      >
        Hide All
      </Button>
      <Title order={2} my={'sm'}>
        Alt/Az
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'AltAzGrid'}
        />
        <NightSkyMarkingBox
          title={'Meridian'}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'MeridianPlane'}
        />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'AltAzGridLabels'}
        />
        <NightSkyMarkingBox
          title={'Zenith'}
          icon={<SingleDotIcon size={IconSize.md} />}
          identifier={'ZenithDot'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        Ecliptic
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EclipticSphere'}
        />
        <NightSkyMarkingBox
          title={'Line'}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EclipticLine'}
        />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EclipticSphereLabels'}
        />
        <NightSkyMarkingBox
          title={'Band'}
          icon={<BandIcon size={IconSize.md} />}
          identifier={'EclipticBand'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        Equatorial
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'EquatorialSphere'}
        />
        <NightSkyMarkingBox
          title={'Line'}
          icon={<LineIcon size={IconSize.md} />}
          identifier={'EquatorialLine'}
        />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={<AbcIcon size={IconSize.md} />}
          identifier={'EquatorialSphereLabels'}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        Constellations
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={<GridSphereIcon size={IconSize.md} />}
          identifier={'ConstellationBounds'}
        />
        <ConstellationShowLinesBox
          title={'Lines'}
          icon={<PencilIcon size={IconSize.md} />}
        />
        <ConstellationsShowArtBox
          title={'Art'}
          icon={<PaintBrushIcon size={IconSize.md} />}
        />
        <ConstellationsShowLabelsBox
          title={'Labels'}
          icon={<AbcIcon size={IconSize.md} />}
        />
      </SimpleGrid>

      <Title order={2} my={'sm'}>
        Cardinal Directions
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <CardinalDirectionsBox
          variant={'small'}
          title={'Small'}
          icon={<CompassSmallIcon size={IconSize.md} />}
        />
        <CardinalDirectionsBox
          variant={'large'}
          title={'Large'}
          icon={<CompassLargeIcon size={IconSize.md} />}
        />
        <CardinalDirectionsBox
          variant={'marks'}
          title={'Marks'}
          icon={<CompassMarksIcon size={IconSize.md} />}
        />
      </SimpleGrid>
    </>
  );
}
