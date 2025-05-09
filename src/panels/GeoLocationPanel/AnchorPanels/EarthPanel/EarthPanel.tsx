import { useState } from 'react';
import { Button, Group, NumberInput, Tabs, Text, TextInput, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { BoolInput } from '@/components/Input/BoolInput';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { useAppSelector } from '@/redux/hooks';
import { Identifier } from '@/types/types';
import { GeoLocationGroupKey, ScenePrefixKey } from '@/util/keys';

import { AddedCustomNodes } from './AddedCustomNodes';
import { CustomCoordinates } from './CustomCoordinates';
import { EarthEntry } from './EarthEntry';
import { ArcGISJSON, Candidate } from './types';
import { addressUTF8 } from './util';

interface Props {
  currentAnchor: Identifier;
}

export function EarthPanel({ currentAnchor }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isCustomAltitude, setIsCustomAltitude] = useState(false);
  const [customAltitude, setCustomAltitude] = useState(300);
  const [places, setPlaces] = useState<Candidate[]>([]);
  const luaApi = useOpenSpaceApi();
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const groups = useAppSelector((state) => state.groups.groups);

  const geoLocationOwners = groups[GeoLocationGroupKey]?.propertyOwners.map((uri) => {
    const index = uri.indexOf(ScenePrefixKey);
    if (index === -1) {
      // Not sure if this fallback is necessary since all of our uri:s will have the
      // prefix key pre-pended to them. If this is not the case, something else is
      // probably broken
      return uri;
    }
    return uri.substring(index + ScenePrefixKey.length);
  });

  const addedCustomNodes = geoLocationOwners ?? [];
  const SearchPlaceKey = 'Search Place';
  const CustomCoordinatesKey = 'Custom Coordinates';

  async function getPlaces(): Promise<void> {
    if (!inputValue) {
      setPlaces([]);
      return;
    }
    const searchString = inputValue.replaceAll(' ', '+');
    try {
      const response = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${searchString}&category=&outFields=*&forStorage=false&f=json`
      );
      const arcGISJson: ArcGISJSON = await response.json();
      // Remove any duplicates from search result
      const uniqueLabels: string[] = [];
      const uniquePlaces = arcGISJson.candidates.filter((place) => {
        const isDuplicate = uniqueLabels.includes(place.attributes.LongLabel);

        if (!isDuplicate) {
          uniqueLabels.push(place.attributes.LongLabel);
          return true;
        }
        return false;
      });

      setPlaces(uniquePlaces);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function addFocusNode(
    identifier: Identifier,
    lat: number,
    long: number,
    alt: number
  ): void {
    // Don't try to add scene graph node if it already exists
    if (isSceneGraphNodeAdded(identifier)) {
      return;
    }
    luaApi?.addSceneGraphNode(
      createSceneGraphNodeTable(currentAnchor, identifier, lat, long, alt)
    );
  }

  function removeFocusNode(identifier: Identifier): void {
    if (!isSceneGraphNodeAdded(identifier)) {
      return;
    }
    luaApi?.removeSceneGraphNode(identifier);
  }

  function isSceneGraphNodeAdded(identifier: Identifier): boolean {
    return `${ScenePrefixKey}${identifier}` in propertyOwners;
  }

  function createSceneGraphNodeTable(
    globe: Identifier,
    identifier: Identifier,
    lat: number,
    long: number,
    alt: number
  ) {
    const table = {
      Identifier: identifier,
      Parent: globe,
      Transform: {
        Translation: {
          Type: 'GlobeTranslation',
          Globe: globe,
          Latitude: lat,
          Longitude: long,
          Altitude: 0
        }
      },
      InteractionSphere: 0,
      BoundingSphere: alt,
      GUI: {
        Path: GeoLocationGroupKey
      }
    };

    return table;
  }

  return (
    <>
      <Tabs variant={'outline'} radius={'md'} defaultValue={SearchPlaceKey}>
        <Tabs.List>
          <Tabs.Tab value={SearchPlaceKey}>Search Place</Tabs.Tab>
          <Tabs.Tab value={CustomCoordinatesKey}>Custom Coordinates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={SearchPlaceKey}>
          <TextInput
            placeholder={'Search places...'}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                getPlaces();
              }
            }}
            onChange={(event) => setInputValue(event.target.value)}
            rightSection={<Button onClick={() => getPlaces()}>Search</Button>}
            rightSectionWidth={'md'}
            my={'xs'}
          />

          <Group justify={'space-between'}>
            <Title order={3} my={'xs'}>
              Results
            </Title>
            <SettingsPopout>
              <BoolInput
                label={'Use custom altitude'}
                value={isCustomAltitude}
                setValue={setIsCustomAltitude}
                info={'Calculates an appropriate altitude automatically if unchecked'}
                m={'xs'}
              />
              <NumberInput
                value={customAltitude}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    setCustomAltitude(value);
                  }
                }}
                label={'Custom altitude (km)'}
                disabled={!isCustomAltitude}
                defaultValue={300}
                min={0}
                m={'xs'}
              />
            </SettingsPopout>
          </Group>

          {places.length > 0 ? (
            <ResizeableContent defaultHeight={250}>
              <FilterList>
                <FilterList.InputField placeHolderSearchText={'Filter search'} />
                <FilterList.SearchResults
                  data={places}
                  renderElement={(place) => (
                    <EarthEntry
                      key={place.attributes.LongLabel}
                      place={place}
                      isCustomAltitude={isCustomAltitude}
                      customAltitude={customAltitude}
                      currentAnchor={currentAnchor}
                      isSceneGraphNodeAdded={isSceneGraphNodeAdded}
                      addFocusNode={addFocusNode}
                      removeFocusNode={removeFocusNode}
                    />
                  )}
                  matcherFunc={generateMatcherFunctionByKeys(['address', 'attributes'])}
                >
                  <FilterList.SearchResults.VirtualList />
                </FilterList.SearchResults>
              </FilterList>
            </ResizeableContent>
          ) : (
            <Text>Nothing found. Try another search!</Text>
          )}
        </Tabs.Panel>
        <Tabs.Panel value={CustomCoordinatesKey}>
          <CustomCoordinates
            currentAnchor={currentAnchor}
            onAddFocusNodeCallback={(address, lat, long, alt) => {
              const identifier = addressUTF8(address);
              addFocusNode(identifier, lat, long, alt);
            }}
          />
        </Tabs.Panel>
      </Tabs>

      <Title order={2} my={'xs'}>
        Added Nodes
      </Title>
      <AddedCustomNodes addedNodes={addedCustomNodes} removeFocusNode={removeFocusNode} />
    </>
  );
}
