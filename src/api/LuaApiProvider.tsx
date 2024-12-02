import { createContext, useContext, useEffect, useState } from 'react';

import { api } from '@/api/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { startConnection } from '@/redux/connection/connectionSlice';
import { closeConnection } from '@/redux/connection/connectionMiddleware';

export const LuaApiContext = createContext<OpenSpace.openspace | null>(null);

export function LuaApiProvider({ children }: { children: React.ReactNode }) {
  const [luaApi, setLuaApi] = useState<OpenSpace.openspace | null>(null);
  const isConnected = useAppSelector((state) => state.connection.isConnected);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startConnection());
    return () => {
      dispatch(closeConnection());
    };
  }, [dispatch]);

  useEffect(() => {
    const fecthApi = async () => {
      try {
        const res = await api.singleReturnLibrary();
        setLuaApi(res);
      } catch (e) {}
    };
    if (isConnected) {
      fecthApi();
    }
  }, [isConnected, api]);

  console.log(luaApi);

  return <LuaApiContext.Provider value={luaApi}>{children}</LuaApiContext.Provider>;
}
