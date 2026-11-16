import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';
import { SkyBrowserTopic } from 'openspace-api-js/types';

import { api } from '@/api/api';
import { onCloseConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';
import { Batcher } from '@/util/batcher';

import {
  resetSkyBrowser,
  subscriptionIsSetup,
  updateSkyBrowser
} from './skybrowserSlice';

const subscribeToSkyBrowser = createAction<void>('skybrowser/subscribe');
const unsubscribeToSkyBrowser = createAction<void>('skybrowser/unsubscribe');

let skybrowserTopic: Topic<'skybrowser'>;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'skyBrowser/setupSubscription',
  async (_, thunkAPI) => {
    skybrowserTopic = api.startTopic('skybrowser', {
      event: 'start_subscription'
    });

    function updateData(data: Partial<SkyBrowserTopic['data']>) {
      thunkAPI.dispatch(updateSkyBrowser(data));
    }

    const batcher = new Batcher<SkyBrowserTopic['data']>(updateData);

    (async () => {
      for await (const data of skybrowserTopic) {
        batcher.add(data);
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
    event: 'stop_subscription'
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

  startListening({
    actionCreator: onCloseConnection,
    effect: (_, listenerApi) => {
      nSubscribers = 0;
      listenerApi.dispatch(unsubscribeToSkyBrowser());
      listenerApi.dispatch(resetSkyBrowser());
    }
  });
};

export { subscribeToSkyBrowser, unsubscribeToSkyBrowser };
