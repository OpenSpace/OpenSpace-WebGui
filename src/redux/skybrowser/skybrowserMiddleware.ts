import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

const subscribeToSkyBrowser = createAction<void>('skybrowser/subscribe');
const unsubscribeToSkyBrowser = createAction<void>('skybrowser/unsubscribe');

import { api } from '@/api/api';

import { AppStartListening } from '../listenerMiddleware';

import { updateSkyBrowser } from './skybrowserSlice';

let skybrowserTopic: any;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'skyBrowser/setupSubscription',
  async (_, thunkAPI) => {
    skybrowserTopic = api.startTopic('skybrowser', {
      event: 'start_subscription'
    });

    (async () => {
      // TODO: add type to the data
      for await (const data of skybrowserTopic.iterator()) {
        thunkAPI.dispatch(updateSkyBrowser(data));
      }
    })();
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
      const { isConnected } = listenerApi.getState().connection;
      if (nSubscribers === 1 && isConnected) {
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
