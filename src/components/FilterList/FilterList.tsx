import { Stack } from '@mantine/core';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { FilterListData } from './FilterListData';
import { FilterListFavorites } from './FilterListFavorites';
import { FilterListInputField } from './FilterListInputField';
import { FilterListProvider } from './FilterListProvider';

interface BaseProps {
  heightFunc?: (height: number) => number;
  heightPercent?: number;
  height?: number | string;
  children: React.ReactNode;
  isLoading?: boolean;
}

interface FuncProps {
  heightPercent?: never;
  height?: never;
}
interface AbsoluteProps {
  heightPercent?: never;
  heightFunc?: never;
}

interface RelativeProps {
  height?: never;
  heightFunc?: never;
}

type Props =
  | (BaseProps & FuncProps)
  | (BaseProps & AbsoluteProps)
  | (BaseProps & RelativeProps);

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
