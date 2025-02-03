import { useCallback, useMemo } from 'react';

import { useGetOptionPropertyValue } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { hasVisibleChildren, identifierFromUri } from '@/util/propertyTreeHelpers';
import { checkCaseInsensitiveSubstringList } from '@/util/stringmatcher';

import { SettingsSearchListItem } from './SettingsSearchListItem';
import { collectSearchableItems, SearchItem, SearchItemType } from './util';

interface Props {
  searchableTopOwners: Uri[];
}

export function SettingsSearchList({ searchableTopOwners }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const propertyOverview = useAppSelector((state) => state.properties.propertyOverview);

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
    let [searchableSubOwners, searchableProperties] = collectSearchableItems(
      searchableTopOwners,
      propertyOwners
    );
    searchableSubOwners = searchableSubOwners.filter((uri) =>
      hasVisibleChildren(uri, visiblityLevelSetting, propertyOwners, propertyOverview)
    );
    searchableProperties = searchableProperties.filter(
      (uri) =>
        visiblityLevelSetting && visiblityLevelSetting >= propertyOverview[uri].visibility
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
          searchKeys: [propertyOverview[uri].name, identifierFromUri(uri)]
        }))
      );
  }, [propertyOverview, propertyOwners, searchableTopOwners, visiblityLevelSetting]);

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
