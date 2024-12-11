import { createContext, Dispatch, SetStateAction } from 'react';

export interface ProviderProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  showFavorites: boolean;
  toggleShowDataInstead: () => void;
  showDataInstead: boolean;
}

export const FilterListContext = createContext<ProviderProps | null>(null);
