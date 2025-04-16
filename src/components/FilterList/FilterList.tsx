import { PropsWithChildren } from 'react';
import { Stack } from '@mantine/core';

import { SearchResults } from './SearchResults/SearchResults';
import { FilterListSearchSettingsMenu } from './SearchSettingsMenu/FilterListSearchSettingsMenu';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface Props extends PropsWithChildren {
  isLoading?: boolean;
  height?: number | string;
}

export function FilterList({ height = '100%', isLoading, children }: Props) {
  return (
    <Stack style={{ height }} gap={'xs'}>
      <FilterListProvider isLoading={isLoading}>{children}</FilterListProvider>
    </Stack>
  );
}

FilterList.InputField = FilterListInputField;
FilterList.Favorites = FilterListFavorites;
FilterList.SearchResults = SearchResults;
FilterList.SearchSettingsMenu = FilterListSearchSettingsMenu;
