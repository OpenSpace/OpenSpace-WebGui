import { Button, SimpleGrid, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';

import { NightSkyCardinalDirectionsBox } from '../components/NightSkyCardinalDirectionsBox';
import { NightSkyConstellationsBox } from '../components/NightSkyConstellationsBox';
import { NightSkyMarkingBox } from '../components/NightSkyMarkingBox';

export function NightSkyMarkingsTab() {
  const openspace = useOpenSpaceApi();

  return (
    <>
      <Button
        mb={'lg'}
        fullWidth
        onClick={() => openspace?.action.triggerAction('os.nightsky.HideAllMarkings')}
      >
        HIDE ALL
      </Button>
      <Title order={2} my={'md'}>
        Alt/Az
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox title={'Grid'} icon={'grid'} identifier={'AltAzGrid'} />
        <NightSkyMarkingBox
          title={'Meridian'}
          icon={'line'}
          identifier={'MeridianPlane'}
        />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={'text'}
          identifier={'AltAzGridLabels'}
        />
        <NightSkyMarkingBox title={'Zenith'} icon={'dot'} identifier={'ZenithDot'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>
        Ecliptic
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox title={'Grid'} icon={'grid'} identifier={'EclipticSphere'} />
        <NightSkyMarkingBox title={'Line'} icon={'line'} identifier={'EclipticLine'} />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={'text'}
          identifier={'EclipticSphereLabels'}
        />
        <NightSkyMarkingBox title={'Band'} icon={'band'} identifier={'EclipticBand'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>
        Equatorial
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={'grid'}
          identifier={'EquatorialSphere'}
        />
        <NightSkyMarkingBox title={'Line'} icon={'line'} identifier={'EquatorialLine'} />
        <NightSkyMarkingBox
          title={'Labels'}
          icon={'text'}
          identifier={'EquatorialSphereLabels'}
        />
      </SimpleGrid>

      <Title order={2} my={'md'}>
        Constellations
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyMarkingBox
          title={'Grid'}
          icon={'grid'}
          identifier={'ConstellationBounds'}
        />
        <NightSkyConstellationsBox
          title={'Lines'}
          icon={'pencil'}
          identifier={'Constellations'}
          onAction={'os.nightsky.ShowConstellationElements'}
          elements
        />
        <NightSkyConstellationsBox
          title={'Art'}
          icon={'paint'}
          identifier={'ImageConstellation-Ori'}
          onAction={'os.constellation_art.ShowArt'}
          offAction={'os.constellation_art.HideArt'}
        />
        <NightSkyConstellationsBox
          title={'Labels'}
          icon={'text'}
          identifier={'Scene.Constellations.Renderable.Labels'}
          onAction={'os.nightsky.FadeInConstellationLabels'}
          offAction={'os.nightsky.FadeOutConstellationLabels'}
        />
      </SimpleGrid>

      <Title order={2} my={'md'}>
        Cardinal Directions
      </Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <NightSkyCardinalDirectionsBox
          variant={'small'}
          title={'Small'}
          icon={'compasssmall'}
        />
        <NightSkyCardinalDirectionsBox
          variant={'large'}
          title={'Large'}
          icon={'compasslarge'}
        />
        <NightSkyCardinalDirectionsBox
          variant={'marks'}
          title={'Marks'}
          icon={'compassmarks'}
        />
      </SimpleGrid>
    </>
  );
}
