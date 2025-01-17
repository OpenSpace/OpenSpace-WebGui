import { Stack } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface FilterListProps {
  children: React.ReactNode;
  height?: number | string; // Absolue value; if it is set, it takes precedence
  heightPercent?: number; // Relative value of window height (percent)
  isLoading?: boolean;
}

export function FilterList({
  height,
  heightPercent = 100,
  isLoading,
  children
}: FilterListProps) {
  const { height: windowHeight } = useWindowSize();
  const calculatedHeight = height ?? windowHeight * (heightPercent / 100);
  return (
    <Stack style={{ height: calculatedHeight }}>
      <FilterListProvider isLoading={isLoading}>{children}</FilterListProvider>
    </Stack>
  );
}

FilterList.InputField = FilterListInputField;
FilterList.Data = FilterListData;
FilterList.Favorites = FilterListFavorites;
