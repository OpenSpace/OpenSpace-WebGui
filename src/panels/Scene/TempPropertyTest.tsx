import { Property } from '@/components/Property/Property';

export function TempPropertyTest() {
  const styleUnfinished = { color: 'red' };

  return (
    <>
      <h3>Bool (Earth):</h3>
      <Property uri={'Scene.Earth.Renderable.Enabled'}></Property>
      <h3>String: </h3>
      <Property uri={'Scene.Earth.Renderable.Type'}></Property>
      <Property uri={'Scene.Earth.Renderable.LightSourceNode'}></Property>
      <h3>Trigger (Earth Blue Marble):</h3>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'}
      ></Property>
      <h3>Option (Earth VIIRS):</h3>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
      ></Property>
      <h3>Selection (Contellation Lines):</h3>
      <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'}></Property>
      <h3 style={styleUnfinished}>String Lists (Server Module - Deny Adresses):</h3>
      <Property uri={'Modules.Server.Interfaces.DefaultTcpSocketInterface.DenyAddresses'}></Property>
      <h3 style={styleUnfinished}>Numeric Property - "Nice" value (Earth opacity):</h3>
      <Property uri={'Scene.Earth.Renderable.Opacity'}></Property>
      <h3 style={styleUnfinished}>Numeric Property - Disabled:</h3>
      <Property uri={'Scene.Earth.Renderable.NActiveLayers'}></Property>
      <h3 style={styleUnfinished}>Numeric Property - Exponential:</h3>
      TODO
    </>
  );
}
