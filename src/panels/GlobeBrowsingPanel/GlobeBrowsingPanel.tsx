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

import { useEffect, useState } from 'react';
import { Button, Group, Select, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { NavigationAnchorKey } from '@/util/keys';

import { CapabilityEntry } from './CapabilityEntry';
import {
  useActiveLayers,
  useCapabilities,
  useGlobeWMSInfo,
  useRenderableGlobes
} from './hooks';
import { Capability, LayerType, layerTypes } from './types';
import { capabilityName } from './util';

export function GlobeBrowsingPanel() {
  // Default to Earth WMS
  const [selectedGlobe, setSelectedGlobe] = useState<string | null>(null);
  const [selectedWMS, setSelectedWMS] = useState<string | null>(null);

  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  const globeBrowsingNodes = useRenderableGlobes();
  const globeWMS = useGlobeWMSInfo(selectedGlobe);
  const capabilities = useCapabilities(selectedWMS);
  const { activeLayers, refresh: refreshActiveLayers } = useActiveLayers(selectedGlobe);
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    // Default select the first WMS server in the list whenever we get a new server info
    if (globeWMS.length > 0) {
      setSelectedWMS(globeWMS[0].name);
    } else {
      setSelectedWMS(null);
    }
  }, [globeWMS]);

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

  async function addLayer(cap: Capability, layerType: LayerType) {
    if (!selectedGlobe) {
      return;
    }

    const layerName = capabilityName(cap.Name);

    await luaApi?.globebrowsing.addLayer(selectedGlobe, layerType, {
      Identifier: layerName,
      Name: cap.Name,
      FilePath: cap.URL,
      Enabled: true
    });
    refreshActiveLayers();
  }

  async function removeLayer(name: string) {
    if (!selectedGlobe) {
      return;
    }

    const layerName = capabilityName(name);
    for (const layerType of layerTypes) {
      if (activeLayers[layerType].includes(layerName)) {
        await luaApi?.globebrowsing.deleteLayer(selectedGlobe, layerType, layerName);
      }
    }

    refreshActiveLayers();
  }

  if (!globeBrowsingNodes) {
    return <LoadingBlocks />;
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <Group gap={'xs'}>
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
            flex={1}
          />
          <Button
            onClick={() => {
              if (!currentAnchor) {
                return;
              }
              if (globeBrowsingNodes.identifiers.includes(currentAnchor)) {
                setSelectedGlobe(currentAnchor);
              }
            }}
          >
            From Focus
          </Button>
        </Group>
        <Select
          value={selectedWMS}
          data={globeWMS.map((info) => {
            return { value: info.name, label: `${info.name} (${info.url})` };
          })}
          onChange={(value) => setSelectedWMS(value)}
          allowDeselect={false}
        />
      </Layout.FixedSection>
      <Group justify={"space-between"}>
        <Title>Name</Title>
        <Title>Add as</Title>
      </Group>
      <Layout.GrowingSection>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search WMS'} />
          <FilterList.SearchResults
            data={capabilities}
            renderElement={(capability) => (
              <CapabilityEntry
                capability={capability}
                onAdd={addLayer}
                onRemove={removeLayer}
                activeLayers={activeLayers}
                key={capability.URL}
              />
            )}
            matcherFunc={generateMatcherFunctionByKeys(['Name'])}
          >
            <FilterList.SearchResults.VirtualList gap={3} />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
