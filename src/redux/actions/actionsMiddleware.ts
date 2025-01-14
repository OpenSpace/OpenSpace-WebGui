import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

export const getAllActions = createAsyncThunk('actions/getAll', async () => {
  // TODO 2024-12-06 ylvse: We should rename all "shortcuts" names to "actions"
  // "shortcut" is a legacy name
  const topic = api.startTopic('shortcuts', {
    event: 'get_all_shortcuts'
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value.shortcuts;
});

// TODO 2024-11-27 (ylvse): This action should be added to the events handling
export const getAction = createAsyncThunk('actions/get', async (uri: string) => {
  const topic = api.startTopic('shortcuts', {
    event: 'get_shortcut',
    identifier: uri
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value.shortcuts;
});

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getAllActions());
    }
  });
};
