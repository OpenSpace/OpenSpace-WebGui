import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

export const getAllShortcuts = createAsyncThunk('actions/getAllShortcuts', async () => {
  const topic = api.startTopic('shortcuts', {
    event: 'get_all_shortcuts'
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value.shortcuts;
});

// TODO 2024-11-27 (ylvse): This action should be added to the events handling
export const getShortcut = createAsyncThunk(
  'actions/getShortcut',
  async (uri: string) => {
    const topic = api.startTopic('shortcuts', {
      event: 'get_shortcut',
      identifier: uri
    });
    const { value } = await topic.iterator().next();
    topic.cancel();
    return value.shortcuts;
  }
);

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getAllShortcuts());
    }
  });
};
