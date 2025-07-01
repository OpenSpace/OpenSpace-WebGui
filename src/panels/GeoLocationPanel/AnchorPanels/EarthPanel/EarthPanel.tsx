import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, NumberInput, Text, TextInput, Title } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { BoolInput } from '@/components/Input/BoolInput';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';

import { EarthEntry } from './EarthEntry';
import { ArcGISJSON, Candidate } from './types';

export function EarthPanel() {
  const [inputValue, setInputValue] = useState('');
  const [useCustomAltitude, setUseCustomAltitude] = useState(false);
  const [customAltitude, setCustomAltitude] = useState(300);
  const [places, setPlaces] = useState<Candidate[]>([]);
  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'earth-panel' });
  const dispatch = useAppDispatch();

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

  return (
    <>
      <Title order={2}>{'Search Places on Earth'}</Title>
      <TextInput
        aria-label={'Search places on Earth'}
        placeholder={t('search.input-placeholder')}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            getPlaces();
          }
        }}
        onChange={(event) => setInputValue(event.target.value)}
        rightSection={<Button onClick={getPlaces}>{t('search.button-label')}</Button>}
        rightSectionWidth={'md'}
      />

      <Group justify={'space-between'}>
        <Title order={3} my={'xs'}>
          {t('search.results-title')}
        </Title>
        <SettingsPopout>
          <BoolInput
            label={t('search.settings.altitude-checkbox')}
            value={useCustomAltitude}
            onChange={setUseCustomAltitude}
            info={t('search.settings.tooltip')}
            m={'xs'}
          />
          <NumberInput
            value={customAltitude}
            onChange={(value) => {
              if (typeof value === 'number') {
                setCustomAltitude(value);
              }
            }}
            label={t('search.settings.altitude-input-label')}
            disabled={!useCustomAltitude}
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
                  useCustomAltitude={useCustomAltitude}
                  customAltitude={customAltitude}
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
    </>
  );
}
