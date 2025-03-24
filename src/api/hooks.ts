import { useContext } from 'react';

import { LuaApiContext } from './LuaApiContext';
// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useContext(LuaApiContext);
  return api;
}
