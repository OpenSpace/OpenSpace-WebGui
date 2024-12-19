import { useEffect } from 'react';
import { Container, Divider, Flex, Loader, ScrollArea, Text, Title } from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { initializeExoplanets } from '@/redux/exoplanets/exoplanetsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
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

  const aim = useGetStringPropertyValue(NavigationAimKey);
  const anchor = useGetStringPropertyValue(NavigationAnchorKey);

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
    // Replace all spaces with underscores
    return (
      addedSystems.findIndex(
        (owner) => owner?.identifier === name2Identifier(starName)
      ) !== -1
    );
  }

  function name2Identifier(starName: string) {
    return starName.replace(/ /g, '_');
  }

  function handleClick(starName: string) {
    const starIdentifier = starName.replace(/ /g, '_');
    if (isAdded(starName)) {
      const matchingAnchor = anchor?.indexOf(starIdentifier) === 0;
      const matchingAim = aim?.indexOf(starIdentifier) === 0;
      if (matchingAnchor || matchingAim) {
        dispatch(setPropertyValue({ uri: NavigationAnchorKey, value: 'Sun' }));
        dispatch(setPropertyValue({ uri: NavigationAimKey, value: '' }));
      }
      luaApi?.exoplanets.removeExoplanetSystem(starName);
    } else {
      luaApi?.exoplanets.addExoplanetSystem(starName);
    }
  }

  return (
    <Container fluid my={'md'}>
      {allSystemNames.length > 0 ? (
        <FilterList placeHolderSearchText={'Star name...'} height={300}>
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
      <CollapsableContent title={'Settings'}>
        <Property uri={HabitableZonePropertyKey} />
        <Property uri={UncertaintyDiscPropertyKey} />
        <Property uri={Size1AuRingPropertyKey} />
      </CollapsableContent>
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
