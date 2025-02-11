import { PaginationList } from '@/components/PaginationList/PaginationList';

import { useSearchResultProvider } from './hooks';

interface Props {
  maxShownMatches?: number; // Maximum number of matches to render at once
}

export function SearchResultsPagination<T>({ maxShownMatches }: Props) {
  const { filteredItems, renderElement } = useSearchResultProvider<T>();

  // If we only allow a certain number of matches to be shown, we need to paginate
  if (maxShownMatches && filteredItems.length > maxShownMatches) {
    return (
      <PaginationList
        data={filteredItems}
        renderElement={renderElement}
        itemsPerPage={maxShownMatches}
      />
    );
  }
  return filteredItems.map(renderElement);
}
