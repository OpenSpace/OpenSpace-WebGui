import { useCallback, useEffect, useState } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';

import {
  Capability,
  GlobeBrowsingNodes,
  LayerType,
  layerTypes,
  OpenSpaceCapabilities,
  OpenSpaceGlobeBrowsingNodes,
  UrlInfo
} from './types';

/**
 * Fetches all layers currently loaded on the globe given by `globeIdentifier`grouped by
 * their respective `LayerType`
 * @param globeIdentifier The globe to get layers for
 * @returns An object containing all layers in their respective group: 'ColorLayers',
 * 'HeightLayers', 'Overlays', 'HeightLayers', 'WaterMasks'
 */
export function useActiveLayers(globeIdentifier: string | null) {
  const [activeLayers, setActiveLayers] = useState<Record<LayerType, string[]>>({
    ColorLayers: [],
    NightLayers: [],
    Overlays: [],
    HeightLayers: [],
    WaterMasks: []
  });
  const luaApi = useOpenSpaceApi();

  const fetchLayers = useCallback(async () => {
    if (!globeIdentifier || !luaApi) {
      return;
    }

    const results = await Promise.all(
      layerTypes.map((type) => luaApi.globebrowsing.layers(globeIdentifier, type))
    );

    const layers = Object.fromEntries(
      layerTypes.map((layerType, index) => {
        const layerObj = results[index] ?? {};
        const layerList = Object.values(layerObj);
        return [layerType, layerList];
      })
    ) as Record<LayerType, string[]>;

    setActiveLayers(layers);
  }, [luaApi, globeIdentifier]);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  return { activeLayers, refresh: fetchLayers };
}

/**
 * Fetches all renderable that is of type `renderableGlobe`
 * @returns An object containing an array of identifiers for all globes currently loaded
 * in the scene and the index for the first globe in the list without an attached WMS
 * server
 */
export function useRenderableGlobes() {
  const [globeBrowsingNodes, setGlobeBrowsingNodes] = useState<GlobeBrowsingNodes | null>(
    null
  );
  const luaApi = useOpenSpaceApi();

  const fetchRenderableGlobes = useCallback(async () => {
    const nodes = (await luaApi?.globebrowsing.globes()) as OpenSpaceGlobeBrowsingNodes;
    const renderableGlobesIdentifiers = Object.values(nodes.identifiers);
    const { firstIndexWithoutUrl } = nodes;

    setGlobeBrowsingNodes({
      firstIndexWithoutUrl,
      identifiers: renderableGlobesIdentifiers
    });
  }, [luaApi]);

  useEffect(() => {
    fetchRenderableGlobes();
  }, [fetchRenderableGlobes]);

  return { globeBrowsingNodes, refresh: fetchRenderableGlobes };
}

/**
 * Fetches the WMS server information for a given renderable globe
 * @param globe The globe to get WMS server info for
 * @returns An array containing WMS server info names and URLs
 */
export function useGlobeWMSInfo(globe: string | null) {
  const [globeWMS, setGlobeWMS] = useState<UrlInfo[]>([]);
  const luaApi = useOpenSpaceApi();

  const fetchGlobeWMSInfo = useCallback(async () => {
    if (!globe) {
      return;
    }
    const urlInfo = await luaApi?.globebrowsing.urlInfo(globe);
    const WMSInfo = Object.values(urlInfo) as UrlInfo[];
    setGlobeWMS(WMSInfo);
  }, [luaApi, globe]);

  useEffect(() => {
    fetchGlobeWMSInfo();
  }, [fetchGlobeWMSInfo]);

  return { globeWMS, refresh: fetchGlobeWMSInfo };
}

/**
 * Fetches the layer capabilities for a given WMS server name
 * @param WMSServer The name of the server to fetch capabilities for
 * @returns An array of capabilities for the given WMS server
 */
export function useCapabilities(WMSServer: string | null) {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    async function fetchCapabilities() {
      if (!WMSServer) {
        setCapabilities([]);
        return;
      }
      const WMSCapabilities = (await luaApi?.globebrowsing.capabilitiesWMS(
        WMSServer
      )) as unknown as OpenSpaceCapabilities;
      const capabilities = Object.values(WMSCapabilities)
        .sort((a, b) => a.Name.localeCompare(b.Name))
        .filter((capability) => capability.Name !== '' && capability.URL !== '');
      setCapabilities(capabilities);
    }
    fetchCapabilities();
  }, [luaApi, WMSServer]);

  return capabilities;
}
