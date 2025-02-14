import { createContext } from 'react';

export type renderFunc<T> = (data: T, i: number) => React.ReactNode;

export interface SearchResultsProviderProps<T> {
  filteredItems: T[];
  renderElement: renderFunc<T>;
}

// We use explicit any here because we can't use a generic type for the a context.
// This is not optimal but right now it seems like the best solution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SearchResultContext = createContext<SearchResultsProviderProps<any> | null>(
  null
);
