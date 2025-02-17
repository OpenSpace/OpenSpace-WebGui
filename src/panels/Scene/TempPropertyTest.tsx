import { Container, ScrollArea } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';

export function TempPropertyTest() {
  const styleUnfinished = { color: 'red' };

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <h2>Bool (Earth):</h2>
        <Property uri={'Scene.Earth.Renderable.Enabled'} />
        <h2>String:</h2>
        <Property uri={'Scene.Earth.Renderable.Type'} />
        <Property uri={'Scene.Earth.Renderable.LightSourceNode'} />
        <h2>Trigger:</h2>
        <Property uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'} />
        <h2>Option:</h2>
        <Property
          uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
        />
        <h2>Selection:</h2>
        <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'} />
        <h2>String Lists:</h2>
        <Property
          uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}
        />
        <h2>Int / Double Lists:</h2>
        <Property uri={'RenderEngine.ScreenshotWindowId'} />
        <h2 style={styleUnfinished}>Numeric Property</h2>
        <h3>"Nice" value (Earth opacity):</h3>
        <Property uri={'Scene.Earth.Renderable.Opacity'} />
        <h3>Disabled:</h3>
        <Property uri={'Scene.Earth.Renderable.NActiveLayers'} />
        <h3>Exponential:</h3>
        <Property uri={'Scene.Earth.ApproachFactor'} />
        <h3>Linear, but not nice values:</h3>
        <Property uri={'Scene.Earth.BoundingSphere'} />
        TODO
        <h2>Vector Property:</h2>
        <h3>Colors</h3>
        <Property uri={'Scene.1ldGrid.Renderable.Color'} />
        <Property uri={'RenderEngine.EnabledFontColor'} />
        <h3>IntVec2</h3>
        <Property uri={'Scene.1ldGrid.Renderable.Segments'} />
        <h3 style={styleUnfinished}>MinMaxRange</h3>
        <Property uri={'Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances'} />
        <h3>TODO: More variants</h3>
        <h2 style={styleUnfinished}>Matrix Property:</h2>
        <Property uri={'Scene.ISS.Renderable.ModelTransform'} />
        <h3 style={styleUnfinished}>A full property owner!</h3>
        <PropertyOwner uri={'Scene.Earth'} />
      </Container>
    </ScrollArea>
  );
}
