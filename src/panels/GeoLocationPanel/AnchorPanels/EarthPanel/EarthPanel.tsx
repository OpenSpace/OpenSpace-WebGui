import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@mantine/core';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { Extent } from './types';

import { ArcGISJSON, Candidate } from './types';

export function EarthPanel({
  onClick,
  onHover,
  search,
  mah
}: {
  onClick: (lat: number, long: number, altitude: number, name: string) => void;
  onHover: (lat: number, long: number) => void;
  search: string;
  mah?: number;
}) {
  const [places, setPlaces] = useState<Candidate[]>([]);

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'earth-panel' });
  const dispatch = useAppDispatch();

  // When opening the panel with a search query, set the input value and fetch places
  useEffect(() => {
    getPlaces(search);
  }, [search]);

  async function getPlaces(input: string): Promise<void> {
    if (!input) {
      setPlaces([]);
      return;
    }
    const searchString = input.replaceAll(' ', '+');
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
      {places.length > 0 ? (
        <FilterList mah={mah}>
          <FilterList.InputField placeHolderSearchText={t('search.filter-placeholder')} />
          <FilterList.SearchResults
            data={places}
            renderElement={(place) => (
              <Button
                w={'100%'}
                mb={3}
                justify="left"
                variant={'default'}
                onClick={() => {
                  onClick(
                    place.location.y,
                    place.location.x,
                    calculateAltitude(place.extent),
                    place.attributes.LongLabel
                  );
                }}
                onMouseOverCapture={() => onHover(place.location.y, place.location.x)}
              >
                {place.attributes.LongLabel}
              </Button>
            )}
            matcherFunc={generateMatcherFunctionByKeys(['address', 'attributes'])}
          >
            <FilterList.SearchResults.VirtualList />
          </FilterList.SearchResults>
        </FilterList>
      ) : (
        <Text>{t('search.no-result')}</Text>
      )}
    </>
  );
}
