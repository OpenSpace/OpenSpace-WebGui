import { Property } from '@/components/Property/Property';

export function Scene() {
  return (
    <div>
      <p>Scene menu: Testing property types:</p>

      <p>Bool (Earth):</p>
      <Property uri={'Scene.Earth.Renderable.Enabled'}></Property>
      <p>String: </p>
      <Property uri={'Scene.Earth.Renderable.Type'}></Property>
      <Property uri={'Scene.Earth.Renderable.LightSourceNode'}></Property>
      <p>Trigger (Earth Blue Marble):</p>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble.Reset'}
      ></Property>
      <p>Option (Earth VIIRS):</p>
      <Property
        uri={'Scene.Earth.Renderable.Layers.ColorLayers.ESRI_VIIRS_Combo.BlendMode'}
      ></Property>
      <p>Selection (Contellation Lines):</p>
      <Property uri={'Scene.Constellations.Renderable.ConstellationSelection'}></Property>
    </div>
  );
}
