import { useCallback, useMemo } from 'react';

import { FilterList } from '@/components/FilterList/FilterList';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { useOptionProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { EnginePropertyVisibilityKey, ScenePrefixKey } from '@/util/keys';
import {
  hasVisibleChildren,
  identifierFromUri,
  isTopLevelPropertyOwner
} from '@/util/propertyTreeHelpers';
import { checkCaseInsensitiveSubstringList } from '@/util/stringmatcher';

import { SettingsSearchListItem } from './SettingsSearchListItem';
import { collectSearchableItems, SearchItem, SearchItemType } from './util';

export function SettingsPanel() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const propertyOverview = useAppSelector((state) => state.properties.propertyOverview);
  const [visiblityLevelSetting] = useOptionProperty(EnginePropertyVisibilityKey);

  // Get all the top property owners, that are not part of the scene
  const topLevelPropertyOwners = useMemo(
    () =>
      Object.keys(propertyOwners).filter(
        (uri) => isTopLevelPropertyOwner(uri) && uri !== ScenePrefixKey.slice(0, -1)
      ),
    [propertyOwners]
  );

  const searchData = useMemo(() => {
    let [searchableSubOwners, searchableProperties] = collectSearchableItems(
      topLevelPropertyOwners,
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
  }, [propertyOverview, propertyOwners, topLevelPropertyOwners, visiblityLevelSetting]);

  const renderfunc = useCallback(
    (item: SearchItem) => (
      <SettingsSearchListItem key={item.uri} type={item.type} uri={item.uri} />
    ),
    []
  );

  const matcher = useCallback((testItem: SearchItem, search: string): boolean => {
    return checkCaseInsensitiveSubstringList(testItem.searchKeys, search);
  }, []);

  return (
    <FilterList>
      <FilterList.InputField placeHolderSearchText={'Search for a setting...'} />
      <FilterList.Favorites>
        {topLevelPropertyOwners.map((uri) => (
          <PropertyOwner uri={uri} key={uri} />
        ))}
      </FilterList.Favorites>
      <FilterList.SearchResults
        data={searchData}
        renderElement={renderfunc}
        matcherFunc={matcher}
      >
        <FilterList.SearchResults.Pagination maxShownMatches={20} />
      </FilterList.SearchResults>
    </FilterList>
  );
}
