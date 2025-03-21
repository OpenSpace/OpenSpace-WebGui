import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { ProfileState } from './profileSlice';

export const getProfile = createAsyncThunk('profile/getProfile', async () => {
  const topic = api.startTopic('profile', {});
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value as ProfileState;
});

export const addProfileListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getProfile());
    }
  });
};
