import { Button, Grid, SimpleGrid, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';

import { IconLabelButton } from '../components/IconLabelButton';

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
      <Title order={2} my={'md'}>Alt/Az</Title>
      <SimpleGrid cols={4} spacing={'sm'}>
          <IconLabelButton title={'Grid'} icon={'grid'} identifier={'AltAzGrid'} />
          <IconLabelButton title={'Meridian'} icon={'line'} identifier={'MeridianPlane'} />
          <IconLabelButton title={'Labels'} icon={'text'} identifier={'AltAzGridLabels'} />
          <IconLabelButton title={'Zenith'} icon={'dot'} identifier={'ZenithDot'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>Ecliptic</Title>
      <SimpleGrid cols={4} spacing={'sm'}>
          <IconLabelButton title={'Grid'} icon={'grid'} identifier={'EclipticSphere'} />
          <IconLabelButton title={'Line'} icon={'line'} identifier={'EclipticLine'} />
          <IconLabelButton title={'Labels'} icon={'text'} identifier={'EclipticSphereLabels'} />
          <IconLabelButton title={'Band'} icon={'band'} identifier={'EclipticBand'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>Equatorial</Title>
      <SimpleGrid cols={4} spacing={'sm'}>
          <IconLabelButton title={'Grid'} icon={'grid'} identifier={'EquatorialSphere'} />
          <IconLabelButton title={'Line'} icon={'line'} identifier={'EquatorialLine'} />
          <IconLabelButton title={'Labels'} icon={'text'} identifier={'EquatorialSphereLabels'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>Constellations</Title>
      <SimpleGrid cols={4} spacing={'sm'}>
          <IconLabelButton title={'Grid'} icon={'grid'} identifier={'ConstellationBounds'} />
          <IconLabelButton title={'Lines'} icon={'pencil'} identifier={'Constellations'} onAction={'os.nightsky.ShowConstellationElements'} boolProp={'Scene.Constellations.Renderable.DrawElements'} />
          <IconLabelButton title={'Art'} icon={'paint'} identifier={'ImageConstellation-Ori'} onAction={'os.constellation_art.ShowArt'} offAction={'os.constellation_art.HideArt'} />
          <IconLabelButton title={'Labels'} icon={'text'} identifier={'Scene.Constellations.Renderable.Labels'} onAction={'os.nightsky.FadeInConstellationLabels'} offAction={'os.nightsky.FadeOutConstellationLabels'} />
      </SimpleGrid>

      <Title order={2} my={'md'}>Cardinal Directions</Title>
      <SimpleGrid cols={4} spacing={'sm'}>
        <IconLabelButton title={'Small'} icon={'compasssmall'} onAction={'os.nightsky.ShowNeswLettersSmall'} offAction={'os.nightsky.HideNesw'} directionCheck={'red_small.png'} />
        <IconLabelButton directionCheck={'red.png'} title={'Large'} icon={'compasslarge'} onAction={'os.nightsky.ShowNeswLetters'} offAction={'os.nightsky.HideNesw'} />
        <IconLabelButton directionCheck={'_lines_'} title={'Marks'} icon={'compassmarks'} onAction={'os.nightsky.AddNeswBandMarks'} offAction={'os.nightsky.RemoveNeswBandMarks'} />
      </SimpleGrid>
    </>
  );
}
