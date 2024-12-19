import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { OpenSpaceVersion } from '@/types/types';

export const getVersion = createAsyncThunk('version/getVersion', async () => {
  const topic = api.startTopic('version', {});
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value as OpenSpaceVersion;
});

export const addVersionListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getVersion());
    }
  });
};
