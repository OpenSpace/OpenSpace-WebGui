import { useLayoutEffect } from 'react';

import { FilterListInputField } from '@/components/FilterList/FilterListInputField';
import { useFilterListProvider } from '@/components/FilterList/hooks';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  placeHolderSearchText?: string;
}

export function ActionsSearchInputField({ placeHolderSearchText }: Props) {
  const { setSearchString } = useFilterListProvider();
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  // Clear the search string when navigating to a new path
  // Use Layout effect to ensure that the search string is cleared
  // before the new path is rendered
  useLayoutEffect(() => {
    setSearchString('');
  }, [navigationPath, setSearchString]);

  return <FilterListInputField placeHolderSearchText={placeHolderSearchText} />;
}
