import { useEffect, useState } from 'react';
import { Container, Divider, Flex, Loader, ScrollArea, Text, Title } from '@mantine/core';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { FilterList } from '@/components/FilterList/FilterList';
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
  const [loadingAdded, setLoadingAdded] = useState<string[]>([]);
  const [loadingRemoved, setLoadingRemoved] = useState<string[]>([]);

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

  const justAdded = loadingAdded.filter(
    (name) => addedSystems.findIndex((s) => s && s.name.includes(name)) !== -1
  );
  const justRemoved = loadingRemoved.filter(
    (name) => addedSystems.findIndex((s) => s && s.name.includes(name)) === -1
  );
  if (justAdded.length > 0) {
    const newAdded = loadingAdded.filter((e) => !justAdded.includes(e));
    setLoadingAdded(newAdded);
  }
  if (justRemoved.length > 0) {
    const newRemoved = loadingRemoved.filter((e) => !justRemoved.includes(e));
    setLoadingRemoved(newRemoved);
  }

  function removeSystem(starName: string, identifier: Identifier) {
    // In case we happen to be focused on the removed system star, reset the focus
    // @TODO (emmbr, 2024-11-29): This will still not check if any of the child nodes are
    // removed... should be fixed, by setting the anchor/aim property correctly on the
    // OpenSpace side instead
    if (anchor === identifier || aim === identifier) {
      setAnchor('Sun');
      setAim('');
    }
    luaApi?.exoplanets.removeExoplanetSystem(starName);
    setLoadingRemoved([...loadingRemoved, starName]);
  }

  function addSystem(starName: string) {
    setLoadingAdded([...loadingAdded, starName]);
    luaApi?.exoplanets.addExoplanetSystem(starName);
  }

  return (
    <Container fluid my={'md'}>
      {allSystemNames.length > 0 ? (
        <FilterList placeHolderSearchText={'Star name...'} height={'500px'}>
          <FilterList.Data<string>
            data={allSystemNames}
            renderElement={(name) => {
              const isAdded = addedSystems.find((s) => s && s.name.includes(name));
              return (
                <ExoplanetEntry
                  key={`entry${name}`}
                  name={name}
                  isLoading={loadingAdded.includes(name) || loadingRemoved.includes(name)}
                  isAdded={isAdded !== undefined}
                  onClick={() =>
                    isAdded ? removeSystem(name, isAdded.identifier) : addSystem(name)
                  }
                />
              );
            }}
            matcherFunc={(name, searchstring) =>
              name.toLowerCase().includes(searchstring.toLowerCase())
            }
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
