import { createContext, Dispatch, SetStateAction } from 'react';

export type renderFunc<T> = (data: T, i: number) => React.ReactNode;

export interface FilterListProviderProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  showFavorites: boolean;
  toggleShowDataInstead: () => void;
  showDataInstead: boolean;
  isLoading: boolean;
}

export const FilterListContext = createContext<FilterListProviderProps | null>(null);
