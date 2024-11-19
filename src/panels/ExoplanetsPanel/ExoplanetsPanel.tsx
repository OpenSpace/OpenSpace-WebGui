import { Fragment, useEffect, useState } from 'react';
import {
  ActionIcon,
  Collapse,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Space,
  Text,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';
import { loadExoplanetsData } from '@/redux/exoplanets/exoplanetsMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  HabitableZonePropertyKey,
  NavigationAimKey,
  NavigationAnchorKey,
  ScenePrefixKey,
  Size1AuRingPropertyKey,
  UncertaintyDiscPropertyKey
} from '@/util/keys';
import { propertyDispatcher } from '@/util/propertyDispatcher';

import { ExoplanetEntry } from './ExoplanetEntry';

export function ExoplanetsPanel() {
  const [loadingAdded, setLoadingAdded] = useState<string[]>([]);
  const [loadingRemoved, setLoadingRemoved] = useState<string[]>([]);

  const [open, { toggle }] = useDisclosure();

  const luaApi = useOpenSpaceApi();
  const propertyOwners = useAppSelector((state) => {
    return state.propertyTree.owners.propertyOwners;
  });

  const isDataInitialized = useAppSelector((state) => state.exoplanets.isInitialized);
  const allSystemNames = useAppSelector((state) => state.exoplanets.data);
  const aim = useGetStringPropertyValue(NavigationAimKey);
  const anchor = useGetStringPropertyValue(NavigationAnchorKey);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDataInitialized) {
      dispatch(loadExoplanetsData());
    }
  }, [dispatch, isDataInitialized]);

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

  function removeSystem(starName: string) {
    const matchingAnchor = anchor?.indexOf(starName) === 0;
    const matchingAim = aim?.indexOf(starName) === 0;
    if (matchingAnchor || matchingAim) {
      propertyDispatcher(dispatch, NavigationAnchorKey).set('Sun');
      propertyDispatcher(dispatch, NavigationAimKey).set('');
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
                  onClick={() => (isAdded ? removeSystem(name) : addSystem(name))}
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
      <Group>
        <ActionIcon onClick={toggle} variant={'default'}>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </ActionIcon>
        <Title order={4}>Settings</Title>
      </Group>
      <Collapse in={open} transitionDuration={300}>
        <Space h={'md'} />
        <Container>
          <Property uri={HabitableZonePropertyKey} />
          <Property uri={UncertaintyDiscPropertyKey} />
          <Property uri={Size1AuRingPropertyKey} />
        </Container>
      </Collapse>
      <Divider my={'xs'}></Divider>
      <Title order={3}>Added Systems</Title>
      <Space h={'md'} />
      <ScrollArea>
        {addedSystems.length === 0 ? (
          <Text>No active systems</Text>
        ) : (
          addedSystems.map(
            (prop) =>
              prop && (
                <Fragment key={`propertyowner${prop.identifier}`}>
                  <PropertyOwner uri={`${ScenePrefixKey}${prop.identifier}`} />
                  <Space h={'xs'} />
                </Fragment>
              )
          )
        )}
      </ScrollArea>
      <Space h={'xs'} />
    </Container>
  );
}
