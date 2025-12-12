import { useCallback, useEffect, useMemo, useState } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Identifier } from '@/types/types';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import {
  Capability,
  GlobeBrowsingNodes,
  OpenSpaceCapabilities,
  OpenSpaceGlobeBrowsingNodes,
  UrlInfo
} from './types';

/**
 * Fetches all layers currently loaded on the globe given by `globeIdentifier`grouped by
 * their respective `LayerType`.
 *
 * @param globeIdentifier The globe to get layers for
 * @returns An object containing all layers in their respective group: 'ColorLayers',
 * 'HeightLayers', 'Overlays', 'HeightLayers', 'WaterMasks'
 */
export function useAddedLayers(globeIdentifier: Identifier | null) {
  const uri = useMemo(
    () =>
      globeIdentifier ? `${sgnRenderableUri(sgnUri(globeIdentifier))}.Layers` : null,
    [globeIdentifier]
  );

  const ColorLayers = usePropertyOwner(`${uri}.ColorLayers`);
  const NightLayers = usePropertyOwner(`${uri}.NightLayers`);
  const Overlays = usePropertyOwner(`${uri}.Overlays`);
  const HeightLayers = usePropertyOwner(`${uri}.HeightLayers`);
  const WaterMasks = usePropertyOwner(`${uri}.WaterMasks`);

  function layerNames(layers: string[]) {
    return layers.map((layer) => layer.substring(layer.lastIndexOf('.') + 1));
  }

  return useMemo(
    () => ({
      ColorLayers: layerNames(ColorLayers?.subowners ?? []),
      NightLayers: layerNames(NightLayers?.subowners ?? []),
      Overlays: layerNames(Overlays?.subowners ?? []),
      HeightLayers: layerNames(HeightLayers?.subowners ?? []),
      WaterMasks: layerNames(WaterMasks?.subowners ?? [])
    }),
    [ColorLayers, NightLayers, Overlays, HeightLayers, WaterMasks]
  );
}

/**
 * Fetches all renderable that is of type `renderableGlobe`.
 *
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
    if (!luaApi) {
      return;
    }
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
 * Fetches the WMS server information for a given renderable globe.
 *
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
    if (!urlInfo) {
      return;
    }
    const WMSInfo = Object.values(urlInfo) as UrlInfo[];
    setGlobeWMS(WMSInfo);
  }, [luaApi, globe]);

  useEffect(() => {
    fetchGlobeWMSInfo();
  }, [fetchGlobeWMSInfo]);

  return { globeWMS, refresh: fetchGlobeWMSInfo };
}

/**
 * Fetches the layer capabilities for a given WMS server name.
 *
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
