import { useState } from 'react';
import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  NumberInput,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { useOpenSpaceApi } from '@/api/hooks';
import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { MinusIcon, PlusIcon } from '@/icons/icons';
import { NodeNavigationButton } from '@/panels/OriginPanel/NodeNavigationButton';
import { useAppSelector } from '@/redux/hooks';
import { NavigationType } from '@/types/enums';
import { ArcGISJSON, Candidate, Extent } from '@/types/types';
import { GeoLocationGroupKey, ScenePrefixKey } from '@/util/keys';

import { CustomCoordinates } from './CustomCoordinates';

interface Props {
  currentAnchor: string;
}
export function EarthPanel({ currentAnchor }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [useCustomAltitude, setUseCustomAltitude] = useState(false);
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

  function addressUTF8(address: string): string {
    // Converts the string to utf-8 format removing any illegal characters
    // \x00-\x7F matches characters between index 0 and index 127, also replaces any
    // space, ',', and '.' characters
    // eslint-disable-next-line no-control-regex
    return address.replace(/[^\x00-\x7F]/g, '').replace(/[\s,.]/g, '_');
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

  function calculateAltitude(extent: Extent): number {
    // Get lat long corners of polygon
    const nw = new LatLng(extent.ymax, extent.xmin);
    const ne = new LatLng(extent.ymax, extent.xmax);
    const sw = new LatLng(extent.ymin, extent.xmin);
    const se = new LatLng(extent.ymin, extent.xmax);
    // Distances are in meters
    const height = computeDistanceBetween(nw, sw);
    const lengthBottom = computeDistanceBetween(sw, se);
    const lengthTop = computeDistanceBetween(nw, ne);
    const maxLength = Math.max(lengthBottom, lengthTop);
    const largestDist = Math.max(height, maxLength);
    // 0.61 is the radian of 35 degrees - half of the standard horizontal field of view in OpenSpace
    return (0.5 * largestDist) / Math.tan(0.610865238);
  }

  return (
    <>
      <Divider my={'xs'} />
      <Accordion defaultValue={'SearchCoordinates'}>
        <Accordion.Item value={'SearchCoordinates'}>
          <Accordion.Control>Search Place</Accordion.Control>
          <Accordion.Panel>
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
            />
            <Divider my={'xs'} />
            <CollapsableContent title={'Settings'}>
              <Group justify={'space-between'} grow>
                <Tooltip
                  label={'Calculates an appropriate altitude automatically if unchecked'}
                >
                  <Checkbox
                    checked={useCustomAltitude}
                    onChange={(event) =>
                      setUseCustomAltitude(event.currentTarget.checked)
                    }
                    label={'Use custom altitude'}
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
                  disabled={!useCustomAltitude}
                  defaultValue={300}
                  min={0}
                />
              </Group>
            </CollapsableContent>
            <Divider my={'xs'} />

            <Title order={3} my={'xs'}>
              Results
            </Title>

            {places.length > 0 ? (
              <FilterList placeHolderSearchText={'Filter search'} height={'350px'}>
                <FilterList.Data<Candidate>
                  data={places}
                  renderElement={(place) => {
                    const address = place.attributes.LongLabel;
                    const addressUtf8 = addressUTF8(address);

                    const isAdded = isSceneGraphNodeAdded(addressUtf8);
                    const cappedAddress = address; // TODO cap address to some fixed size?
                    const lat = place.location.y;
                    const long = place.location.x;
                    const alt = useCustomAltitude
                      ? customAltitude * 1000
                      : calculateAltitude(place.extent);
                    return (
                      <Group
                        key={address}
                        gap={'xs'}
                        mb={2}
                        justify={'space-between'}
                        wrap={'nowrap'}
                      >
                        {/* TODO temporary css to stop long names from linebreaking causing the
                      buttons to be moved to a new row, the maxwidth is just arbitrary
                      minus the size of the buttons... */}
                        <Text
                          style={{
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textWrap: 'nowrap',
                            maxWidth: 350 - 125
                          }}
                        >
                          {cappedAddress}
                          {cappedAddress.length !== address.length ? '...' : ''}
                        </Text>

                        <Group gap={'xs'} wrap={'nowrap'}>
                          <NodeNavigationButton
                            type={NavigationType.FlyGeo}
                            identifier={currentAnchor}
                            lat={lat}
                            long={long}
                            alt={alt}
                          />
                          <NodeNavigationButton
                            type={NavigationType.JumpGeo}
                            identifier={currentAnchor}
                            lat={lat}
                            long={long}
                            alt={alt}
                          />
                          <ActionIcon
                            onClick={() =>
                              isAdded
                                ? removeFocusNode(addressUtf8)
                                : addFocusNode(addressUtf8, lat, long, alt)
                            }
                            size={'lg'}
                            color={isAdded ? 'red' : 'blue'}
                          >
                            {isAdded ? <MinusIcon /> : <PlusIcon />}
                          </ActionIcon>
                        </Group>
                      </Group>
                    );
                  }}
                  matcherFunc={generateMatcherFunctionByKeys(['address', 'attributes'])}
                />
              </FilterList>
            ) : (
              <Text>Nothing found. Try another search!</Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={'CustomCoordinates'}>
          <Accordion.Control>Custom Coordinates</Accordion.Control>
          <Accordion.Panel>
            <CustomCoordinates
              currentAnchor={currentAnchor}
              onAddFocusNodeCallback={(address, lat, long, alt) => {
                const identifier = addressUTF8(address);
                addFocusNode(identifier, lat, long, alt);
              }}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
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
