import { Container, Title } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';

/**
 * A Dev Panel to test the different views for property types and property owners.
 */
export function PropertyTest() {
  return (
    <Container>
      <Title order={3}>Bool (Earth):</Title>
      <Property uri={'Scene.Earth.Renderable.Enabled'} />

      <Title order={3}>String:</Title>
      <Property uri={'Scene.Earth.Renderable.Type'} />
      <Property uri={'Scene.Earth.Renderable.LightSourceNode'} />

      <Title order={3}>Trigger:</Title>
      <Property uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'} />

      <Title order={3}>Option:</Title>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
      />

      <Title order={3}>Selection:</Title>
      <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'} />

      <Title order={3}>String Lists:</Title>
      <Property
        uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}
      />

      <Title order={3}>Int / Double Lists:</Title>
      <Property uri={'RenderEngine.ScreenshotWindowId'} />

      <Title order={3}>Numeric Property:</Title>
      <Container>
        <Title order={4}>"Nice" value (Earth opacity):</Title>
        <Property uri={'Scene.Earth.Renderable.Opacity'} />
        <Title order={4}>Disabled:</Title>
        <Property uri={'Scene.Earth.Renderable.NActiveLayers'} />
        <Title order={4}>Exponential:</Title>
        <Property uri={'Scene.Earth.ApproachFactor'} />
        <Title order={4}>Linear, but not nice values:</Title>
        <Property uri={'Scene.Earth.BoundingSphere'} />
        <Title order={4}>Int:</Title>
        <Property uri={'Scene.EclipticLine.Renderable.CircleSegments'} />
      </Container>

      <Title order={3}>Vector Property:</Title>
      <Container>
        <Title order={4}>Colors:</Title>
        <Property uri={'Scene.1ldGrid.Renderable.Color'} />
        <Property uri={'RenderEngine.EnabledFontColor'} />
        <Title order={4}>IntVec2:</Title>
        <Property uri={'Scene.1ldGrid.Renderable.Segments'} />
        <Title order={4}>MinMaxRange:</Title>
        <Property uri={'Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances'} />
        {/* @TODO (2025-04-29, emmbr): Add more variants of vectors*/}
      </Container>

      <Title order={3}>Matrix Property:</Title>
      <Property uri={'Scene.ISS.Renderable.ModelTransform'} />

      <Title order={3}>A full property owner:</Title>
      <PropertyOwner uri={'Scene.Earth'} />
    </Container>
  );
}
