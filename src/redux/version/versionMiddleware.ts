import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

export const getVersion = createAsyncThunk('version/getVersion', async () => {
  const topic = api.startTopic('version', {});
  const data = await topic.next();
  topic.cancel();
  return data;
});

export const addVersionListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getVersion());
    }
  });
};
