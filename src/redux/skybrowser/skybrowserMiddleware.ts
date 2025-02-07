import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { ConnectionStatus } from '@/types/enums';

import { AppStartListening } from '../listenerMiddleware';

import { subscriptionIsSetup, updateSkyBrowser } from './skybrowserSlice';
import { SkyBrowserUpdate } from '@/types/skybrowsertypes';

const subscribeToSkyBrowser = createAction<void>('skybrowser/subscribe');
const unsubscribeToSkyBrowser = createAction<void>('skybrowser/unsubscribe');

let skybrowserTopic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'skyBrowser/setupSubscription',
  async (_, thunkAPI) => {
    skybrowserTopic = api.startTopic('skybrowser', {
      event: 'start_subscription'
    });

    (async () => {
      for await (const data of skybrowserTopic.iterator()) {
        thunkAPI.dispatch(updateSkyBrowser(data as SkyBrowserUpdate));
      }
    })();
    thunkAPI.dispatch(subscriptionIsSetup());
  }
);

function tearDownSubscription() {
  if (!skybrowserTopic) {
    return;
  }
  skybrowserTopic.talk({
    event: 'stop_supscription'
  });
  skybrowserTopic.cancel();
}

export const addSkyBrowserListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: subscribeToSkyBrowser,
    effect: (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToSkyBrowser,
    effect: () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        tearDownSubscription();
      }
    }
  });
};

export { subscribeToSkyBrowser, unsubscribeToSkyBrowser };
