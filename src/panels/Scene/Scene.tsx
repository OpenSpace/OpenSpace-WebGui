import { Skeleton } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { useAppSelector } from '@/redux/hooks';

export function Scene() {
  const propertyOwners = useAppSelector((state) => state.propertyTree.owners.propertyOwners);
  const hasLoadedScene = Object.keys(propertyOwners).length > 0;

  function loadingBlocks(n: number) {
    return [...Array(n)].map((_, i) =>
      <Skeleton key={i} height={8} width={`${Math.random() * 100}%`} radius="xl" />
    )
  }

  return (
    <div>
      {!hasLoadedScene ?
        <>
          <p>Scene menu: Testing property types:</p>
          {loadingBlocks(4)}
        </>
        :
        <>
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
        </>
      }
    </div>
  );
}
