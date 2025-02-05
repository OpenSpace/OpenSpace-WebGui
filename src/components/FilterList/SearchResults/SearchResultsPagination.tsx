import { PaginationList } from '@/components/PaginationList/PaginationList';

import { useSearch } from './hooks';
import { SearchResultsProps } from './SearchResults';

interface Props<T> extends SearchResultsProps<T> {
  maxShownMatches?: number; // Maximum number of matches to render at once
}

export function SearchResultsPagination<T>({
  matcherFunc,
  data,
  renderElement,
  maxShownMatches
}: Props<T>) {
  const filteredElements = useSearch(matcherFunc, data);

  // If we only allow a certain number of matches to be shown, we need to paginate
  if (maxShownMatches && filteredElements.length > maxShownMatches) {
    return (
      <PaginationList
        data={filteredElements}
        renderElement={renderElement}
        itemsPerPage={maxShownMatches}
      />
    );
  }
  return filteredElements.map(renderElement);
}
