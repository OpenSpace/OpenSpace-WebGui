import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { Uri } from '@/types/types';

export const getAllActions = createAsyncThunk('actions/getAll', async () => {
  const topic = api.startTopic('actionsKeybinds', {
    event: 'get_all'
  });
  const data = await topic.next();
  if (data.type !== 'combined') {
    throw new Error(`Expected keybinds in data, got '${data}'`);
  }
  topic.cancel();
  return data;
});

export const getAction = createAsyncThunk('actions/get', async (uri: Uri) => {
  const topic = api.startTopic('actionsKeybinds', {
    event: 'get_action',
    identifier: uri
  });
  const data = await topic.next();
  if (data.type !== 'action') {
    throw new Error(`Expected action, got '${data}'`);
  }
  topic.cancel();
  return data.action;
});

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getAllActions());
    }
  });
};
