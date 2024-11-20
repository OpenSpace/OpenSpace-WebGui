import { Container } from '@mantine/core';

import { Property } from '@/components/Property/Property';

export function TempPropertyTest() {
  const styleUnfinished = { color: 'red' };

  return (
    <Container>
      <h3>Bool (Earth):</h3>
      <Property uri={'Scene.Earth.Renderable.Enabled'} />
      <h3>'String: '</h3>
      <Property uri={'Scene.Earth.Renderable.Type'} />
      <Property uri={'Scene.Earth.Renderable.LightSourceNode'} />
      <h3>Trigger (Earth Blue Marble):</h3>
      <Property uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'} />
      <h3>Option (Earth VIIRS):</h3>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
      />
      <h3>Selection (Contellation Lines):</h3>
      <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'} />
      <h3 style={styleUnfinished}>String Lists (Server Module - Deny Adresses):</h3>
      TODO: Make the tags (list items) editable
      <Property
        uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}
      />
      <h3 style={styleUnfinished}>Numeric Property - "Nice" value (Earth opacity):</h3>
      TODO: Come up with a nice version of the input, that also feels responsive....
      Testing:
      <Property uri={'Scene.Earth.Renderable.Opacity'} />
      <h3 style={styleUnfinished}>Numeric Property - Disabled:</h3>
      TODO: This should somehow show info on max/min value. This specific property is a
      good example of why
      <Property uri={'Scene.Earth.Renderable.NActiveLayers'} />
      <h3 style={styleUnfinished}>Numeric Property - Exponential:</h3>
      TODO
      <h3 style={styleUnfinished}>Numeric Property - Linear, but not nice values:</h3>
      TODO
      <h3 style={styleUnfinished}>Vector Property:</h3>
      Vec3 (Color) - 1 lightday grid
      <Property uri={'Scene.1ldGrid.Renderable.Color'} />
      IntVec2 - 1 lightday grid
      <Property uri={'Scene.1ldGrid.Renderable.Segments'} />
      MinMaxRange - SDSS FadeIn distances
      <Property uri={'Scene.SloanDigitalSkySurvey.Renderable.Fading.FadeInDistances'} />
      TODO: More variants. E.g. MinMaxRange. Vec3 and Vec4 colors
      <h3 style={styleUnfinished}>Matrix Property:</h3>
      Mat4: ISS Model transform
      <Property uri={'Scene.ISS.Renderable.ModelTransform'} />
    </Container>
  );
}
