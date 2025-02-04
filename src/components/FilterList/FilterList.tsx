import { Stack } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface BaseProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

interface FuncHeightProps extends BaseProps {
  heightFunc?: (height: number) => number;
  heightPercent?: never;
  height?: never;
}

interface AbsoluteHeightProps extends BaseProps {
  height?: number | string;
  heightPercent?: never;
  heightFunc?: never;
}

interface RelativeHeightProps extends BaseProps {
  heightPercent?: number;
  height?: never;
  heightFunc?: never;
}

type Props = FuncHeightProps | AbsoluteHeightProps | RelativeHeightProps;

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
FilterList.Data = FilterListData;
FilterList.Favorites = FilterListFavorites;
