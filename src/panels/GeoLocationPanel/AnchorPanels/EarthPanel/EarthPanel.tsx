import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  NumberInput,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { MinusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { ArcGISJSON, Candidate } from '@/types/types';
import { GeoLocationGroupKey, ScenePrefixKey } from '@/util/keys';

import { CustomCoordinates } from './CustomCoordinates';
import { EarthEntry } from './EarthEntry';
import { addressUTF8 } from './util';

interface Props {
  currentAnchor: string;
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
    identifier: string,
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

  function removeFocusNode(identifier: string): void {
    if (!isSceneGraphNodeAdded(identifier)) {
      return;
    }
    luaApi?.removeSceneGraphNode(identifier);
  }

  function isSceneGraphNodeAdded(uri: string): boolean {
    return `${ScenePrefixKey}${uri}` in propertyOwners;
  }

  function createSceneGraphNodeTable(
    globe: string,
    identifier: string,
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
              <Tooltip
                label={'Calculates an appropriate altitude automatically if unchecked'}
              >
                <Checkbox
                  checked={isCustomAltitude}
                  onChange={(event) => setIsCustomAltitude(event.currentTarget.checked)}
                  label={'Use custom altitude'}
                  m={'xs'}
                />
              </Tooltip>
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
            <FilterList placeHolderSearchText={'Filter search'} height={'350px'}>
              <FilterList.Data<Candidate>
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
              />
            </FilterList>
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

      <Divider my={'xs'} />

      <Title order={2} my={'md'}>
        Added Nodes
      </Title>
      {addedCustomNodes.length > 0 ? (
        <Container my={'md'}>
          {addedCustomNodes.map((identifier) => (
            <Group gap={'xs'} key={identifier} mb={2}>
              <ActionIcon onClick={() => removeFocusNode(identifier)} color={'red'}>
                <MinusIcon />
              </ActionIcon>
              <Text
                style={{
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textWrap: 'nowrap',
                  maxWidth: '300px'
                }}
              >
                {identifier}
              </Text>
            </Group>
          ))}
        </Container>
      ) : (
        <Text>No added nodes</Text>
      )}
    </>
  );
}
