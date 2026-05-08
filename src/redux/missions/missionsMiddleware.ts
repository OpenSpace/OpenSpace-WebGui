import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';

import { clearMissions, initializeMissions } from './missionsSlice';

export const refreshMissions = createAction<void>('missions/refreshMissions');

const getMissions = createAsyncThunk('missions/getMissions', async (_, thunkAPI) => {
  const missionTopic = api.startTopic('missions', {});
  const data = await missionTopic.next();

  const hasMission = Object.keys(data.missions).length > 0;

  if (hasMission) {
    thunkAPI.dispatch(initializeMissions(data.missions));
  } else {
    thunkAPI.dispatch(clearMissions());
  }
});

export const addMissionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, api) => {
      api.dispatch(getMissions());
    }
  });

  startListening({
    actionCreator: refreshMissions,
    effect: (_, api) => {
      api.dispatch(getMissions());
    }
  });
};
