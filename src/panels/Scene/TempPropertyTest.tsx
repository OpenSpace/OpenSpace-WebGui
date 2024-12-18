import { Container, Text } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';

export function TempPropertyTest() {
  const styleUnfinished = { color: 'red' };

  return (
    <Container>
      <h2>Bool (Earth):</h2>
      <Text c={'dimmed'}>Scene.Earth.Renderable.Enabled</Text>
      <Property uri={'Scene.Earth.Renderable.Enabled'} />
      <h2>String:</h2>
      <Text c={'dimmed'}>Scene.Earth.Renderable.Type</Text>
      <Property uri={'Scene.Earth.Renderable.Type'} />
      <Text c={'dimmed'}>Scene.Earth.Renderable.LightSourceNode</Text>
      <Property uri={'Scene.Earth.Renderable.LightSourceNode'} />
      <h2>Trigger:</h2>
      <Text c={'dimmed'}>
        Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset
      </Text>
      <Property uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'} />
      <h2>Option:</h2>
      <Text c={'dimmed'}>
        Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode
      </Text>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
      />
      <h2>Selection:</h2>
      <Text c={'dimmed'}>Scene.Constellations.Renderable.ConstellationSelection</Text>
      <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'} />
      <h2>String Lists:</h2>
      <Text c={'dimmed'}>
        Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses
      </Text>
      <Property
        uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}
      />
      <h2 style={styleUnfinished}>Numeric Property - "Nice" value (Earth opacity):</h2>
      TODO: Come up with a nice version of the input, that also feels responsive....
      Testing:
      <Property uri={'Scene.Earth.Renderable.Opacity'} />
      <h2 style={styleUnfinished}>Numeric Property - Disabled:</h2>
      TODO: This should somehow show info on max/min value. This specific property is a
      good example of why
      <Property uri={'Scene.Earth.Renderable.NActiveLayers'} />
      <h2 style={styleUnfinished}>Numeric Property - Exponential:</h2>
      TODO
      <h2 style={styleUnfinished}>Numeric Property - Linear, but not nice values:</h2>
      TODO
      <h2 style={styleUnfinished}>Vector Property:</h2>
      <h3>Colors</h3>
      <Text c={'dimmed'}>Scene.1ldGrid.Renderable.Color</Text>
      <Property uri={'Scene.1ldGrid.Renderable.Color'} />
      <Text c={'dimmed'}>RenderEngine.EnabledFontColor</Text>
      <Property uri={'RenderEngine.EnabledFontColor'} />
      <h3>IntVec2</h3>
      <Text c={'dimmed'}>Scene.1ldGrid.Renderable.Segments</Text>
      <Property uri={'Scene.1ldGrid.Renderable.Segments'} />
      <h3 style={styleUnfinished}>MinMaxRange</h3>
      <Text c={'dimmed'}>
        Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances
      </Text>
      <Property uri={'Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances'} />
      <h3>TODO: More variants</h3>
      <h2 style={styleUnfinished}>Matrix Property:</h2>
      <Text c={'dimmed'}>Scene.ISS.Renderable.ModelTransform</Text>
      <Property uri={'Scene.ISS.Renderable.ModelTransform'} />
      <h3 style={styleUnfinished}>A full property owner!</h3>
      <PropertyOwner uri={'Scene.Earth'} />
    </Container>
  );
}
