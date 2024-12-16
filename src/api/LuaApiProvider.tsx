import { PropsWithChildren, useEffect, useState } from 'react';

import { api } from '@/api/api';
import { closeConnection } from '@/redux/connection/connectionMiddleware';
import { startConnection } from '@/redux/connection/connectionSlice';
import { updateCustomGroupOrdering } from '@/redux/groups/groupsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { LuaApiContext } from './LuaApiContext';

export function LuaApiProvider({ children }: PropsWithChildren) {
  const [luaApi, setLuaApi] = useState<OpenSpace.openspace | null>(null);
  const isConnected = useAppSelector((state) => state.connection.isConnected);
  const dispatch = useAppDispatch();

  // Connect to OpenSpace
  useEffect(() => {
    dispatch(startConnection());
    return () => {
      dispatch(closeConnection());
    };
  }, [dispatch]);

  // Get the Lua Api once the connection has been made
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

  // The groups ordering is not part of any topic so we request it
  // once we have the api
  // TODO 2024-12-02 (ylvse): make this a part of a topic?
  useEffect(() => {
    async function fetchData() {
      if (luaApi) {
        // This is really a map with an array of strings, but Lua formats arrays as
        // objects with numerical indexes as key
        type LuaStringArray = { [index: number]: string };
        type LuaGuiOrderMap = { [guiPath: string]: LuaStringArray };
        const res = (await luaApi.guiOrder()) as LuaGuiOrderMap;

        // Convert the values to an array
        const formattedRes: { [key: string]: string[] } = {};
        Object.keys(res).forEach((key: string) => {
          const luaObject = res[key];
          formattedRes[key] = luaObject ? Object.values(luaObject) : [];
        });
        dispatch(updateCustomGroupOrdering(formattedRes));
      }
    }
    if (luaApi) {
      fetchData();
    }
  }, [luaApi, dispatch]);

  return <LuaApiContext.Provider value={luaApi}>{children}</LuaApiContext.Provider>;
}
