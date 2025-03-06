import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { Missions } from '@/panels/MissionsPanel/types';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';

import { clearMissions, initializeMissions } from './missionsSlice';

export const refreshMissions = createAction<void>('missions/refreshMissions');

interface MissionData {
  done: boolean;
  value: {
    missions: Missions | null;
  };
}

const getMissions = createAsyncThunk('missions/getMissions', async (_, thunkAPI) => {
  const missionTopic = api.startTopic('missions', {});
  const { value } = (await missionTopic.iterator().next()) as MissionData;
  if (value.missions) {
    thunkAPI.dispatch(initializeMissions(value.missions));
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
