import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { MatchedLocation } from './types';
import { computeAltitude, fetchPlacesEarth, fetchPlacesExtraTerrestrial } from './util';

interface Props {
  onClick: (lat: number, long: number, altitude: number, name: string) => void;
  onHover: (lat: number, long: number) => void;
  search: string;
}

export function GeoSearch({ onClick, onHover, search }: Props) {
  const [places, setPlaces] = useState<MatchedLocation[]>([]);

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'earth-panel' });
  const dispatch = useAppDispatch();
  const anchor = useAnchorNode();
  const performSearch = useCallback(getPlaces, [dispatch, anchor]);

  // When opening the panel with a search query, set the input value and fetch places
  useEffect(() => {
    performSearch(search);
  }, [search, performSearch]);

  async function getPlaces(input: string): Promise<void> {
    if (!input) {
      setPlaces([]);
      return;
    }
    const searchString = input.replaceAll(' ', '+');
    try {
      if (!anchor?.name) {
        return;
      }
      const searchResult =
        anchor.name === 'Earth'
          ? await fetchPlacesEarth(searchString)
          : await fetchPlacesExtraTerrestrial(anchor.name, searchString);
      setPlaces(searchResult);
    } catch (error) {
      dispatch(
        handleNotificationLogging(
          'Error fetching geo location data',
          error,
          LogLevel.Error
        )
      );
    }
  }

  return (
    <>
      {places.length > 0 ? (
        <FilterList>
          <FilterList.InputField placeHolderSearchText={t('search.filter-placeholder')} />
          <FilterList.SearchResults
            data={places}
            renderElement={(place: MatchedLocation) => {
              const { centerLatitude, centerLongitude, name } = place;
              return (
                <Button
                  w={'100%'}
                  mb={3}
                  justify={'left'}
                  variant={'default'}
                  onClick={() => {
                    const altitude = computeAltitude(place);
                    onClick(centerLatitude, centerLongitude, altitude, name);
                  }}
                  onMouseOverCapture={() => onHover(centerLatitude, centerLongitude)}
                >
                  {name}
                </Button>
              );
            }}
            matcherFunc={generateMatcherFunctionByKeys(['name'])}
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
