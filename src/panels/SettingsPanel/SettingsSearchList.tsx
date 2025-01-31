import { useCallback, useMemo } from 'react';

import { useGetOptionPropertyValue } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  hasVisibleChildren,
  identifierFromUri,
  isPropertyVisible
} from '@/util/propertyTreeHelpers';
import { checkCaseInsensitiveSubstringList } from '@/util/stringmatcher';

import { SettingsSearchListItem } from './SettingsSearchListItem';
import { collectSearchableItemsRecursively, SearchItem, SearchItemType } from './util';

interface Props {
  searchableTopOwners: Uri[];
}

export function SettingsSearchList({ searchableTopOwners }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: We want to avoid getting the entire property object here, since it also
  // includes the value of the properties. This means that the entire menu is rerendered
  // as soon as a property changes...
  // TODO: Split up properties state so that values and meta are two different objects
  const properties = useAppSelector((state) => state.properties.properties);

  const [visiblityLevelSetting] = useGetOptionPropertyValue(EnginePropertyVisibilityKey);

  const renderfunc = useCallback(
    (item: SearchItem) => (
      <SettingsSearchListItem key={item.uri} type={item.type} uri={item.uri} />
    ),
    []
  );

  const matcher = useCallback((testItem: SearchItem, search: string): boolean => {
    return checkCaseInsensitiveSubstringList(testItem.searchKeys, search);
  }, []);

  const searchData = useMemo(() => {
    let searchableSubOwners: Uri[] = [];
    let searchableProperties: Uri[] = [];
    [searchableSubOwners, searchableProperties] = collectSearchableItemsRecursively(
      searchableTopOwners,
      propertyOwners,
      searchableSubOwners,
      searchableProperties
    );

    searchableSubOwners = searchableSubOwners.filter((uri) =>
      hasVisibleChildren(uri, visiblityLevelSetting, propertyOwners, properties)
    );
    searchableProperties = searchableProperties.filter((uri) =>
      isPropertyVisible(properties[uri]!, visiblityLevelSetting)
    );
    return searchableSubOwners
      .map((uri) => ({
        type: SearchItemType.SubPropertyOwner,
        uri,
        searchKeys: [propertyOwners[uri]!.name, identifierFromUri(uri)]
      }))
      .concat(
        searchableProperties.map((uri) => ({
          type: SearchItemType.Property,
          uri,
          searchKeys: [properties[uri]!.description.name, identifierFromUri(uri)]
        }))
      );
  }, [properties, propertyOwners, searchableTopOwners, visiblityLevelSetting]);

  return (
    <FilterList.Data<SearchItem>
      data={searchData}
      // Do not virtualize here, since this requires the rendered objects to have a fixed
      // size, which PropertyOwners won\t. Also, the list is not expected to be very long
      virtualize={false}
      renderElement={renderfunc}
      matcherFunc={matcher}
    />
  );
}
