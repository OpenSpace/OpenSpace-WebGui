import { useEffect } from 'react';
import { Container, Divider, ScrollArea, Text, Title } from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { Property } from '@/components/Property/Property';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { initializeExoplanets } from '@/redux/exoplanets/exoplanetsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Identifier } from '@/types/types';
import {
  HabitableZonePropertyKey,
  NavigationAimKey,
  NavigationAnchorKey,
  Size1AuRingPropertyKey,
  UncertaintyDiscPropertyKey
} from '@/util/keys';
import { sgnUri } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeHeader } from '../Scene/SceneGraphNode/SceneGraphNodeHeader';

import { ExoplanetEntry } from './ExoplanetEntry';

export function ExoplanetsPanel() {
  const luaApi = useOpenSpaceApi();

  const propertyOwners = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners;
  });

  const isDataInitialized = useAppSelector((state) => state.exoplanets.isInitialized);
  const allSystemNames = useAppSelector((state) => state.exoplanets.data);
  const [aim, setAim] = useGetStringPropertyValue(NavigationAimKey);
  const [anchor, setAnchor] = useGetStringPropertyValue(NavigationAnchorKey);

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
    <Container fluid my={'md'}>
      <ResizeableContent defaultHeight={300}>
        <FilterList isLoading={allSystemNames.length === 0}>
          <FilterList.InputField placeHolderSearchText={'Star name...'} />
          <FilterList.SearchResults>
            <FilterList.SearchResults.VirtualList<string>
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
            />
          </FilterList.SearchResults>
        </FilterList>
      </ResizeableContent>
      <Collapsable title={'Settings'}>
        <Property uri={HabitableZonePropertyKey} />
        <Property uri={UncertaintyDiscPropertyKey} />
        <Property uri={Size1AuRingPropertyKey} />
      </Collapsable>
      <Divider my={'xs'}></Divider>
      <Title order={3}>Added Systems</Title>
      <ScrollArea my={'md'}>
        {addedSystems.length === 0 ? (
          <Text>No active systems</Text>
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
      </ScrollArea>
    </Container>
  );
}
