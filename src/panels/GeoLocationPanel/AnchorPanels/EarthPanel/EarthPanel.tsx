import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
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
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
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
  const { t } = useTranslation('geolocationpanel', { keyPrefix: 'earth-panel' });
  const dispatch = useAppDispatch();

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
      dispatch(handleNotificationLogging('Error fetching data', error, LogLevel.Error));
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
          <Tabs.Tab value={SearchPlaceKey}>{t('tab-search')}</Tabs.Tab>
          <Tabs.Tab value={CustomCoordinatesKey}>{t('tab-custom-coordinates')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={SearchPlaceKey}>
          <TextInput
            placeholder={t('search.input-placeholder')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                getPlaces();
              }
            }}
            onChange={(event) => setInputValue(event.target.value)}
            rightSection={
              <Button onClick={() => getPlaces()}>{t('search.button-label')}</Button>
            }
            rightSectionWidth={'md'}
            my={'xs'}
          />

          <Group justify={'space-between'}>
            <Title order={3} my={'xs'}>
              {t('search.results-title')}
            </Title>
            <SettingsPopout>
              <Tooltip label={t('search.settings.tooltip')}>
                <Checkbox
                  checked={isCustomAltitude}
                  onChange={(event) => setIsCustomAltitude(event.currentTarget.checked)}
                  label={t('search.settings.altitude-checkbox')}
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
                label={t('search.settings.altitude-input-label')}
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
                <FilterList.InputField
                  placeHolderSearchText={t('search.filter-placeholder')}
                />
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
            <Text>{t('search.no-result')}</Text>
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
        {t('added-nodes-title')}
      </Title>
      <AddedCustomNodes addedNodes={addedCustomNodes} removeFocusNode={removeFocusNode} />
    </>
  );
}
