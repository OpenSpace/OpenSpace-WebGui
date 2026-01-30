import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FilterList } from '@/components/FilterList/FilterList';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { usePropertyValue } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTree/propertyOwnerSlice';
import { propertySelectors } from '@/redux/propertyTree/propertySlice';
import { EnginePropertyVisibilityKey, ScenePrefixKey } from '@/util/keys';
import { isPropertyVisible } from '@/util/propertyTreeHelpers';
import { hasVisibleChildren } from '@/util/propertyTreeSelectors';
import { checkCaseInsensitiveSubstringList } from '@/util/stringmatcher';
import { identifierFromUri, isTopLevelPropertyOwner } from '@/util/uris';

import { SettingsSearchListItem } from './SettingsSearchListItem';
import { collectSearchableItems, SearchItem, SearchItemType } from './util';

export function SettingsPanel() {
  const { t } = useTranslation('panel-settings');

  const propertyOwners = useAppSelector((state) =>
    propertyOwnerSelectors.selectEntities(state)
  );

  const properties = useAppSelector((state) => propertySelectors.selectEntities(state));

  const visiblityLevelSetting = usePropertyValue(
    'OptionProperty',
    EnginePropertyVisibilityKey
  );

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
      hasVisibleChildren(propertyOwners, properties, uri, visiblityLevelSetting)
    );
    searchableProperties = searchableProperties.filter((uri) =>
      isPropertyVisible(properties[uri].metaData.visibility, visiblityLevelSetting)
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
          searchKeys: [properties[uri].metaData.guiName, identifierFromUri(uri)]
        }))
      );
  }, [propertyOwners, topLevelPropertyOwners, visiblityLevelSetting, properties]);

  const renderfunc = useCallback(
    (item: SearchItem) => (
      <SettingsSearchListItem key={item.uri} type={item.type} uri={item.uri} />
    ),
    []
  );

  const matcher = useCallback((testItem: SearchItem, search: string): boolean => {
    return checkCaseInsensitiveSubstringList(testItem.searchKeys, search);
  }, []);

  if (topLevelPropertyOwners.length === 0) {
    return <LoadingBlocks />;
  }

  return (
    <FilterList>
      <FilterList.InputField placeHolderSearchText={t('search-settings-placeholder')} />
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
