import { Container, Divider, ScrollArea } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';

/**
 * A Dev Panel to test the different views for property types and property owners.
 */
export function PropertyTest() {
  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Divider />
        <h3>Bool (Earth):</h3>
        <Property uri={'Scene.Earth.Renderable.Enabled'} />
        <h3>String:</h3>
        <Property uri={'Scene.Earth.Renderable.Type'} />
        <Property uri={'Scene.Earth.Renderable.LightSourceNode'} />
        <h3>Trigger:</h3>
        <Property uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'} />
        <h3>Option:</h3>
        <Property
          uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
        />
        <h3>Selection:</h3>
        <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'} />
        <h3>String Lists:</h3>
        <Property
          uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}
        />
        <h3>Int / Double Lists:</h3>
        <Property uri={'RenderEngine.ScreenshotWindowId'} />
        <h3>Numeric Property</h3>
        <h4>"Nice" value (Earth opacity):</h4>
        <Property uri={'Scene.Earth.Renderable.Opacity'} />
        <h4>Disabled:</h4>
        <Property uri={'Scene.Earth.Renderable.NActiveLayers'} />
        <h4>Exponential:</h4>
        <Property uri={'Scene.Earth.ApproachFactor'} />
        <h4>Linear, but not nice values:</h4>
        <Property uri={'Scene.Earth.BoundingSphere'} />
        <h4>Int:</h4>
        <Property uri={'Scene.EclipticLine.Renderable.CircleSegments'} />

        <h3>Vector Property:</h3>
        <h4>Colors</h4>
        <Property uri={'Scene.1ldGrid.Renderable.Color'} />
        <Property uri={'RenderEngine.EnabledFontColor'} />
        <h4>IntVec2</h4>
        <Property uri={'Scene.1ldGrid.Renderable.Segments'} />
        <h4>MinMaxRange</h4>
        <Property uri={'Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances'} />
        <h4>TODO: More variants</h4>
        <h3>Matrix Property:</h3>
        <Property uri={'Scene.ISS.Renderable.ModelTransform'} />
        <h3>A full property owner!</h3>
        <PropertyOwner uri={'Scene.Earth'} />
      </Container>
    </ScrollArea>
  );
}
