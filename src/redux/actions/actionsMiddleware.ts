import { createAction } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { ActionOrKeybind } from '@/types/types';

import { addActions, initializeShortcuts } from './actionsSlice';

async function getAllShortcuts(): Promise<ActionOrKeybind[]> {
  const topic = api.startTopic('shortcuts', {
    event: 'get_all_shortcuts'
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value.shortcuts;
}

async function getShortcut(uri: string): Promise<ActionOrKeybind[]> {
  const topic = api.startTopic('shortcuts', {
    event: 'get_shortcut',
    identifier: uri
  });
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value.shortcuts;
}
const getAction = createAction<string>('getAction');

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      const result = await getAllShortcuts();
      listenerApi.dispatch(initializeShortcuts(result));
    }
  });

  startListening({
    actionCreator: getAction,
    effect: async (action, listenerApi) => {
      const result = await getShortcut(action.payload);
      listenerApi.dispatch(addActions(result));
    }
  });
};
