import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@mantine/core';

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

  const dispatch = useAppDispatch();
  const anchor = useAnchorNode();

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'search' });

  const performSearch = useCallback(getPlaces, [dispatch, anchor, t]);

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
          t('notifications.error-geolocation-data.title'),
          error,
          LogLevel.Error
        )
      );
    }
  }

  if (places.length === 0) {
    return <Text>{t('empty-results')}</Text>;
  }

  return (
    <>
      {places.map((place) => {
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
      })}
    </>
  );
}
