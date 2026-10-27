import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { updateAssetState, updatePathList, updateStatesSnapshot } from './assetTreeSlice';

export const subscribeToAssetTree = createAction<void>('assetTree/subscribe');
export const unsubscribeToAssetTree = createAction<void>('assetTree/unsubscribe');
export const rescanAssetTree = createAction<void>('assetTree/rescanAssetTree');

let topic: Topic<'assetTree'> | null = null;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'assetTree/setupSubscription',
  async (_, thunkApi) => {
    topic = api.startTopic('assetTree', {
      event: 'start_subscription'
    });
    (async () => {
      for await (const data of topic) {
        if (data.type === 'pathList') {
          thunkApi.dispatch(updatePathList(data));
        }
        if (data.type === 'stateSnapshot') {
          thunkApi.dispatch(updateStatesSnapshot(data));
        }
        if (data.type === 'state') {
          thunkApi.dispatch(updateAssetState(data));
        }
      }
    })();
  }
);

function unsubscribe() {
  if (!topic) {
    return;
  }

  topic.talk({
    event: 'stop_subscription'
  });
  topic.cancel();
  topic = null;
}

function rescanAssets() {
  if (!topic) {
    return;
  }
  topic.talk({
    event: 'scan_assets'
  });
}

export const addAssetTreeListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToAssetTree,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToAssetTree,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });

  startListening({
    actionCreator: rescanAssetTree,
    effect: rescanAssets
  });
};
