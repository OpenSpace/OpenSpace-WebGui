import { PropsWithChildren } from 'react';
import { Stack } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SearchResults } from './SearchResults/SearchResults';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface FuncHeightProps {
  heightFunc?: (height: number) => number;
  heightPercent?: never;
  height?: never;
}

interface AbsoluteHeightProps {
  height?: number | string;
  heightPercent?: never;
  heightFunc?: never;
}

interface RelativeHeightProps {
  heightPercent?: number;
  height?: never;
  heightFunc?: never;
}

type HeightProps = FuncHeightProps | AbsoluteHeightProps | RelativeHeightProps;

interface BaseProps extends PropsWithChildren {
  isLoading?: boolean;
}

type Props = HeightProps & BaseProps;

export function FilterList({
  height,
  heightFunc,
  heightPercent,
  isLoading,
  children
}: Props) {
  const { height: windowHeight } = useWindowSize();

  const calculatedHeight =
    height ??
    (heightPercent && windowHeight * (heightPercent / 100.0)) ??
    (heightFunc && heightFunc(windowHeight)) ??
    '100%';

  return (
    <Stack style={{ height: calculatedHeight }}>
      <FilterListProvider isLoading={isLoading}>{children}</FilterListProvider>
    </Stack>
  );
}

FilterList.InputField = FilterListInputField;
FilterList.Favorites = FilterListFavorites;
FilterList.SearchResults = SearchResults;
