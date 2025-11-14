/*
Get all renderable globes -> all renderable gloves and then filter them eg.

We want the globes that has a WMS server to be shown at the top of this list
-> basically sort based on if URL exists or not for that particular globe

This list selects the node of which we want to add WMS maps to.

Also add a button that selects the node from the current focus node, if the focus is not a globe -- do nothing

Serverlist - gets the server urls for a specific globe,

Server is selected by name

Add Server - adds a new server with a name and a server URL
Set it to the selected server

Delete server - Removes the currently selected server

Script to add a layer is the following

    auto addFunc = [n = _currentNode, &l](const std::string& type) {
        std::string layerName = l.name;
        std::replace(layerName.begin(), layerName.end(), '.', '-');
        layerName.erase(
            std::remove(layerName.begin(), layerName.end(), ' '),
            layerName.end()
        );
        const std::string script = std::format(
            "openspace.globebrowsing.addLayer(\
                    '{}', \
                    '{}', \
                    {{ \
                        Identifier = '{}',\
                        Name = '{}',\
                        FilePath = '{}',\
                        Enabled = true\
                    }}\
                );",
            n,
            type,
            layerName,
            l.name,
            l.url
        );
        global::scriptEngine->queueScript(script);
    };

    where the type is:
        addFunc("ColorLayers");
        addFunc("NightLayers");
        addFunc("Overlays");
        addFunc("HeightLayers");
        addFunc("WaterMasks");
*/

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { NavigationAnchorKey } from '@/util/keys';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  Capability,
  GlobeBrowsingNodes,
  LayerType,
  OpenSpaceCapabilities,
  OpenSpaceGlobeBrowsingNodes
} from './types';
import { CapabilityEntry } from './CapabilityEntry';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useAppSelector } from '@/redux/hooks';
import { sgnGuiPath } from '@/hooks/sceneGraphNodes/util';
import { useActiveLayers, useRenderableGlobes } from './hooks';

export function GlobeBrowsingPanel() {
  // Default to Earth WMS
  const [selectedGlobe, setSelectedGlobe] = useState<string | null>(null);
  const [selectedWMS, setSelectedWMS] = useState<string | null>(null);

  const [globeWMS, setGlobeWMS] = useState<UrlInfo[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  const globeBrowsingNodes = useRenderableGlobes();
  const activeLayers = useActiveLayers(selectedGlobe);

  const luaApi = useOpenSpaceApi();

  // Fetches the WMS servers for the currently selected globe
  useEffect(() => {
    async function getGlobeWMSInfo() {
      if (!selectedGlobe) {
        return;
      }
      const urlInfo = await luaApi?.globebrowsing.urlInfo(selectedGlobe);
      const WMSInfo = Object.values(urlInfo) as UrlInfo[];
      setGlobeWMS(WMSInfo);
      // Default select the first one in the list
      setSelectedWMS(WMSInfo[0].name);
    }

    getGlobeWMSInfo();
  }, [selectedGlobe]);

  // Sets default selected globe node
  useEffect(() => {
    if (!globeBrowsingNodes) {
      return;
    }
    // Set Earth as default selected if it is loaded in the scene
    const selectGlobe = globeBrowsingNodes.identifiers.includes('Earth')
      ? 'Earth'
      : globeBrowsingNodes.identifiers[0];

    setSelectedGlobe(selectGlobe);
  }, [globeBrowsingNodes]);

  useEffect(() => {});

  // Fetches capabilities for the selected globe and WMS
  useEffect(() => {
    async function fetchCapabilities() {
      if (!selectedWMS) {
        return;
      }
      const WMSCapabilities = (await luaApi?.globebrowsing.capabilitiesWMS(
        selectedWMS
      )) as unknown as OpenSpaceCapabilities;
      const capabilities = Object.values(WMSCapabilities).sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );
      setCapabilities(capabilities);
    }
    fetchCapabilities();
  }, [selectedWMS]);

  function addLayer(cap: Capability, layerType: LayerType) {
    if (!selectedGlobe) {
      return;
    }

    const layerName = cap.Name.replaceAll('.', '-').replaceAll(' ', '');

    luaApi?.globebrowsing.addLayer(selectedGlobe, layerType, {
      Identifier: layerName,
      Name: cap.Name,
      FilePath: cap.URL,
      Enabled: true
    });
  }

  if (!globeBrowsingNodes) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Select
        value={selectedGlobe}
        data={[
          {
            group: 'Globes with WMS',
            items: globeBrowsingNodes.identifiers.slice(
              0,
              globeBrowsingNodes.firstIndexWithoutUrl
            )
          },
          {
            group: 'Globes without WMS',
            items: globeBrowsingNodes.identifiers.slice(
              globeBrowsingNodes.firstIndexWithoutUrl
            )
          }
        ]}
        onChange={(value) => setSelectedGlobe(value)}
        allowDeselect={false}
      />
      <Select
        value={selectedWMS}
        data={globeWMS.map((info) => {
          return { value: info.name, label: `${info.name} (${info.url})` };
        })}
        onChange={(value) => setSelectedWMS(value)}
        allowDeselect={false}
      />
      <FilterList>
        <FilterList.InputField placeHolderSearchText="Search WMS" />
        <FilterList.SearchResults
          data={capabilities}
          renderElement={(capability) => (
            <CapabilityEntry
              capability={capability}
              onClick={addLayer}
              key={capability.URL}
            />
          )}
          matcherFunc={generateMatcherFunctionByKeys(['Name'])}
        >
          <FilterList.SearchResults.VirtualList />
        </FilterList.SearchResults>
      </FilterList>
    </>
  );
}
