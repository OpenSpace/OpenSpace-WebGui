import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { Uri } from '@/types/types';

export const getAllActions = createAsyncThunk('actions/getAll', async () => {
  const topic = api.startTopic('actionsKeybinds', {
    event: 'get_all'
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value;
});

export const getAction = createAsyncThunk('actions/get', async (uri: Uri) => {
  const topic = api.startTopic('actionsKeybinds', {
    event: 'get_action',
    identifier: uri
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value;
});

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getAllActions());
    }
  });
};
