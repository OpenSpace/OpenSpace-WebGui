import { useEffect } from 'react';
import { Container, Divider, Flex, Loader, ScrollArea, Text, Title } from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { initializeExoplanets } from '@/redux/exoplanets/exoplanetsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Identifier } from '@/types/types';
import {
  HabitableZonePropertyKey,
  NavigationAimKey,
  NavigationAnchorKey,
  ScenePrefixKey,
  Size1AuRingPropertyKey,
  UncertaintyDiscPropertyKey
} from '@/util/keys';

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

  // Find already existing exoplent systems among the property owners
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
    const starIdentifier = name2Identifier(starName);
    if (isAdded(starName)) {
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
      {allSystemNames.length > 0 ? (
        <FilterList height={300}>
          <FilterList.InputField placeHolderSearchText={'Star name...'} />
          <FilterList.Data<string>
            data={allSystemNames}
            renderElement={(name) => {
              return (
                <ExoplanetEntry
                  key={`entry${name}`}
                  name={name}
                  isAdded={isAdded(name)}
                  onClick={() => handleClick(name)}
                />
              );
            }}
            matcherFunc={wordBeginningSubString}
          ></FilterList.Data>
        </FilterList>
      ) : (
        <Flex align={'center'} justify={'center'} style={{ height: '500px' }}>
          <Loader />
        </Flex>
      )}
      <Divider my={'xs'} />
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
            (prop) =>
              prop && (
                <PropertyOwner
                  key={prop.identifier}
                  uri={`${ScenePrefixKey}${prop.identifier}`}
                />
              )
          )
        )}
      </ScrollArea>
    </Container>
  );
}
