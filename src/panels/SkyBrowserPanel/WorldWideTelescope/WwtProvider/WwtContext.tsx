import { createContext } from 'react';

export interface ProviderProps {
  ref: React.RefObject<HTMLIFrameElement>;
  setAim: (
    ra: number | undefined,
    dec: number | undefined,
    fov: number | undefined,
    roll: number | undefined
  ) => void;
  setBorderColor: (color: [number, number, number]) => void;
  setBorderRadius: (radius: number) => void;
  loadImage: (url: string) => void;
  setOpacity: (url: string, opacity: number) => void;
  removeImage: (id: string) => void;
  imageCollectionLoaded: boolean;
  wwtHasLoaded: boolean;
}

export const WwtContext = createContext<ProviderProps | null>(null);
