import { createAction } from '@reduxjs/toolkit';
import { ActionOrKeybind } from 'src/types/types';

import { api } from '@/api/api';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

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
  try {
    const { value } = await topic.iterator().next();
    topic.cancel();
    return value.shortcuts;
  } catch (e) {
    console.error(e);
    return [];
  }
}
const getAction = createAction<string>('getAction');

export const addActionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      try {
        const result = await getAllShortcuts();
        listenerApi.dispatch(initializeShortcuts(result));
      } catch (e) {
        console.error(e);
      }
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
