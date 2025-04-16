import { PropsWithChildren } from 'react';
import { Stack } from '@mantine/core';

import { SearchResults } from './SearchResults/SearchResults';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';
import { FilterListSearchSettingsMenu } from './SearchSettingsMenu/FilterListSearchSettingsMenu';

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
