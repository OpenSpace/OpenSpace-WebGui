import { useOpenSpaceApi } from '@/api/hooks';
import { useEffect, useState } from 'react';
import {
  GlobeBrowsingNodes,
  LayerType,
  OpenSpaceGlobeBrowsingNodes,
  UrlInfo
} from './types';

export function useActiveLayers(globeIdentifier: string | null) {
  const [activeLayers, setActiveLayers] = useState<Record<LayerType, string[]>>({
    ColorLayers: [],
    NightLayers: [],
    Overlays: [],
    HeightLayers: [],
    WaterMasks: []
  });
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    async function fetchLayers() {
      if (!globeIdentifier || !luaApi) {
        return;
      }

      const categories: LayerType[] = [
        'ColorLayers',
        'HeightLayers',
        'Overlays',
        'HeightLayers',
        'WaterMasks'
      ] as const;

      const results = await Promise.all(
        categories.map((cat) => luaApi.globebrowsing.layers(globeIdentifier, cat))
      );

      const layers = Object.fromEntries(
        categories.map((cat, index) => {
          const layerObj = results[index] ?? {};
          const layerList = Object.values(layerObj);
          return [cat, layerList];
        })
      ) as Record<LayerType, string[]>;

      setActiveLayers(layers);
    }

    fetchLayers();
  }, [luaApi, globeIdentifier]);

  return activeLayers;
}

// Fetch the current renderableGlobes
export function useRenderableGlobes() {
  const [globeBrowsingNodes, setGlobeBrowsingNodes] = useState<GlobeBrowsingNodes | null>(
    null
  );
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    async function fetchRenderableGlobes() {
      const nodes =
        (await luaApi?.globebrowsing.globeNodes()) as OpenSpaceGlobeBrowsingNodes;
      const renderableGlobesIdentifiers = Object.values(nodes.identifiers);
      const firstIndexWithoutUrl = nodes.firstIndexWithoutUrl;

      setGlobeBrowsingNodes({
        firstIndexWithoutUrl,
        identifiers: renderableGlobesIdentifiers
      });
    }

    fetchRenderableGlobes();
  }, [luaApi]);

  return globeBrowsingNodes;
}

// Fetches the WMS servers for the currently selected globe
export function useGlobeWMSInfo(globe: string | null) {
  const [globeWMS, setGlobeWMS] = useState<UrlInfo[]>([]);
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    async function getGlobeWMSInfo() {
      if (!globe) {
        return;
      }
      const urlInfo = await luaApi?.globebrowsing.urlInfo(globe);
      const WMSInfo = Object.values(urlInfo) as UrlInfo[];
      setGlobeWMS(WMSInfo);
      // Default select the first one in the list
      setSelectedWMS(WMSInfo[0].name);
    }

    getGlobeWMSInfo();
  }, [globe]);

  return;
}
