import { createContext } from 'react';
import { OpenSpaceLibrary } from 'openspace-api-js/generated';

export const LuaApiContext = createContext<OpenSpaceLibrary | null>(null);
