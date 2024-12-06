import { useEffect } from 'react';
import {
  ActionIcon,
  Collapse,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Text,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
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
  const [open, { toggle }] = useDisclosure();

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
    if (!isDataInitialized) {
      dispatch(loadExoplanetsData());
    }
  }, [dispatch, isDataInitialized]);

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
        propertyDispatcher(dispatch, NavigationAnchorKey).set('Sun');
        propertyDispatcher(dispatch, NavigationAimKey).set('');
      }
      luaApi?.exoplanets.removeExoplanetSystem(starName);
    } else {
      luaApi?.exoplanets.addExoplanetSystem(starName);
    }
  }

  return (
    <Container fluid my={'md'}>
      {allSystemNames.length > 0 ? (
        <FilterList placeHolderSearchText={'Star name...'} height={'500px'}>
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
      <Group>
        <ActionIcon onClick={toggle} variant={'default'}>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </ActionIcon>
        <Title order={4}>Settings</Title>
      </Group>
      <Collapse in={open} transitionDuration={300}>
        <Container mt={'md'}>
          <Property uri={HabitableZonePropertyKey} />
          <Property uri={UncertaintyDiscPropertyKey} />
          <Property uri={Size1AuRingPropertyKey} />
        </Container>
      </Collapse>
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
