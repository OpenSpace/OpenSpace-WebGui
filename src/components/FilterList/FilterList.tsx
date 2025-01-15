import { Stack } from '@mantine/core';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface FilterListProps {
  children: React.ReactNode;
  height?: number | string;
}

export function FilterList({ height = '100%', children }: FilterListProps) {
  return (
    <Stack style={{ height: height }}>
      <FilterListProvider>{children}</FilterListProvider>
    </Stack>
  );
}

FilterList.InputField = FilterListInputField;
FilterList.Data = FilterListData;
FilterList.Favorites = FilterListFavorites;
