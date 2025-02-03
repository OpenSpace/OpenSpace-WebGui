import { useMemo } from 'react';
import { Container, ScrollArea } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { ScenePrefixKey } from '@/util/keys';
import { isTopLevelPropertyOwner } from '@/util/propertyTreeHelpers';

import { SettingsSearchList } from './SettingsSearchList';

export function SettingsPanel() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // Get all the top property owners, that are not part of the scene
  const topLevelPropertyOwners = useMemo(
    () =>
      Object.keys(propertyOwners).filter(
        (uri) => isTopLevelPropertyOwner(uri) && uri !== ScenePrefixKey.slice(0, -1)
      ),
    [propertyOwners]
  );

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search...'} />
          <FilterList.Favorites>
            {topLevelPropertyOwners.map((uri) => (
              <PropertyOwner uri={uri} key={uri} />
            ))}
          </FilterList.Favorites>
          {/* This component creates the FilterList.Data component */}
          <SettingsSearchList searchableTopOwners={topLevelPropertyOwners} />
        </FilterList>
      </Container>
    </ScrollArea>
  );
}
