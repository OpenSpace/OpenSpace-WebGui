import { createAction } from '@reduxjs/toolkit';

import { api } from '@/api/api';

import { AppStartListening } from '../listenerMiddleware';

import { initializeExoplanets } from './exoplanetsSlice';

const removeExoplanets = createAction<{ system: string }>('removeExoplanets');
const loadExoplanetsData = createAction<void>('loadExoplanetsData');

export const addExoplanetListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: loadExoplanetsData,
    effect: async (_, listenerApi) => {
      const state = listenerApi.getState();
      const planetList = await state.luaApi?.exoplanets.listOfExoplanets();
      if (!planetList) {
        return;
      }
      const planets = Object.values(planetList).map((item) => ({
        name: item,
        identifier: item
      }));
      listenerApi.dispatch(initializeExoplanets(planets));
    }
  });
  startListening({
    actionCreator: removeExoplanets,
    effect: (action) => {
      const script = `openspace.exoplanets.removeExoplanetSystem('${action.payload.system}')`;
      // TODO: (ylvse 2024-10-14) - Should the last argument be true here? In the old repo there was nothing in the
      // third argument
      api.executeLuaScript(script, false, true);
    }
  });
};
