import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useProperty } from '@/hooks/properties';
import { initializeExoplanets } from '@/redux/exoplanets/exoplanetsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTree/propertyOwnerSlice';
import { Identifier } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { sgnUri } from '@/util/uris';

import { SceneGraphNodeHeader } from '../Scene/SceneGraphNode/SceneGraphNodeHeader';

import { ExoplanetEntry } from './ExoplanetEntry';
import { ExoplanetsSettings } from './ExoplanetsSettings';

export function ExoplanetsPanel() {
  const { t } = useTranslation('panel-exoplanets');

  const propertyOwners = useAppSelector((state) =>
    propertyOwnerSelectors.selectEntities(state)
  );
  const isDataInitialized = useAppSelector((state) => state.exoplanets.isInitialized);
  const allSystemNames = useAppSelector((state) => state.exoplanets.data);
  const [aim, setAim] = useProperty('StringProperty', NavigationAimKey);
  const [anchor, setAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  const luaApi = useOpenSpaceApi();

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      const res = await luaApi?.exoplanets.listOfExoplanets();
      if (res) {
        dispatch(initializeExoplanets(Object.values(res)));
      }
    }
    if (luaApi || !isDataInitialized) {
      fetchData();
    }
  }, [luaApi, dispatch, isDataInitialized]);

  // Find already existing exoplanet systems among the property owners
  const addedSystems = Object.values(propertyOwners).filter((owner) =>
    owner!.tags.includes('exoplanet_system')
  );

  function isAdded(starName: string) {
    return (
      addedSystems.findIndex(
        (owner) => owner?.identifier === name2Identifier(starName)
      ) !== -1
    );
  }

  // TODO: this is not a foolproof function to get the identifier.
  // We should get the identifiers from the engine or redesign the panel
  // This function copies what the engine does to create the identifiers
  function name2Identifier(starName: string): Identifier {
    let identifier = starName.replaceAll('_', ' ');
    const punctuationRegex = /[!"#$%&'()*+\-./:;<=>?@[\\\]^_`{|}~]/g;
    identifier = identifier.replace(punctuationRegex, '-');
    return identifier.replaceAll(' ', '_');
  }

  function handleClick(starName: string) {
    if (isAdded(starName)) {
      const starIdentifier = name2Identifier(starName);
      const matchingAnchor = anchor?.indexOf(starIdentifier) === 0;
      const matchingAim = aim?.indexOf(starIdentifier) === 0;
      if (matchingAnchor || matchingAim) {
        setAnchor('Sun');
        setAim('');
      }
      luaApi?.exoplanets.removeExoplanetSystem(starName);
    } else {
      luaApi?.exoplanets.addExoplanetSystem(starName);
    }
  }

  return (
    <>
      <ResizeableContent defaultHeight={300}>
        <FilterList isLoading={allSystemNames.length === 0}>
          <FilterList.InputField
            placeHolderSearchText={t('exoplanet-search-placeholder', {
              numberStars: allSystemNames.length
            })}
          />
          <FilterList.SearchResults
            data={allSystemNames}
            renderElement={(name) => (
              <ExoplanetEntry
                key={`entry${name}`}
                name={name}
                isAdded={isAdded(name)}
                onClick={() => handleClick(name)}
              />
            )}
            matcherFunc={wordBeginningSubString}
          >
            <FilterList.SearchResults.VirtualList />
          </FilterList.SearchResults>
        </FilterList>
      </ResizeableContent>
      <ExoplanetsSettings hasAddedExoplanets={addedSystems.length > 0} />
      <Divider my={'xs'}></Divider>
      <Title order={3}>{t('added-systems.title')}</Title>
      {addedSystems.length === 0 ? (
        <Text>{t('added-systems.no-active-systems')}</Text>
      ) : (
        addedSystems.map(
          (hostStar) =>
            hostStar && (
              <SceneGraphNodeHeader
                key={hostStar.identifier}
                uri={sgnUri(hostStar.identifier)}
              />
            )
        )
      )}
    </>
  );
}
