import { createAction } from '@reduxjs/toolkit';

import { AppStartListening } from '@/redux/listenerMiddleware';

import { initializeExoplanets } from './exoplanetsSlice';

export const loadExoplanetsData = createAction<void>('loadExoplanetsData');

export const addExoplanetListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: loadExoplanetsData,
    effect: async (_, listenerApi) => {
      const state = listenerApi.getState();
      const planetList = await state.luaApi?.exoplanets.listOfExoplanets();
      if (!planetList) {
        return;
      }
      listenerApi.dispatch(initializeExoplanets(Object.values(planetList)));
    }
  });
};
