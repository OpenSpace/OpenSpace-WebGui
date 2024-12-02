import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { updateTime } from './timeSlice';

const subscribeToTime = createAction<void>('subscribeToTime');
const unsubscribeToTime = createAction<void>('unsubscribeToTime');

let timeTopic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'time/setupSubscription',
  async (_, thunkAPI) => {
    timeTopic = api.startTopic('time', {
      event: 'start_subscription'
    });

    (async () => {
      for await (const data of timeTopic.iterator()) {
        thunkAPI.dispatch(updateTime(data));
      }
    })();
  }
);

function tearDownSubscription() {
  if (!timeTopic) {
    return;
  }
  timeTopic.talk({
    event: 'stop_supscription'
  });
  timeTopic.cancel();
}

export const addTimeListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, listenerApi) => {
      if (nSubscribers > 0) {
        //listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToTime,
    effect: (_, listenerApi) => {
      ++nSubscribers;
      const { isConnected } = listenerApi.getState().connection;
      if (nSubscribers === 1 && isConnected) {
        //listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToTime,
    effect: () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        tearDownSubscription();
      }
    }
  });
};

export { subscribeToTime, unsubscribeToTime };
