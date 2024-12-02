import { createContext, useEffect, useState } from 'react';

import { api } from '@/api/api';
import { closeConnection } from '@/redux/connection/connectionMiddleware';
import { startConnection } from '@/redux/connection/connectionSlice';
import { updateCustomGroupOrdering } from '@/redux/groups/groupsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

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
    const fetchApi = async () => {
      try {
        const res = await api.singleReturnLibrary();
        setLuaApi(res);
      } catch (e) {
        console.error(e);
      }
    };
    if (isConnected) {
      fetchApi();
    }
  }, [isConnected]);

  useEffect(() => {
    async function fetchData() {
      if (luaApi) {
        const res = await luaApi.guiOrder();
        dispatch(updateCustomGroupOrdering(res));
      }
    }
    if (luaApi) {
      fetchData();
    }
  }, [luaApi, dispatch]);

  return <LuaApiContext.Provider value={luaApi}>{children}</LuaApiContext.Provider>;
}
