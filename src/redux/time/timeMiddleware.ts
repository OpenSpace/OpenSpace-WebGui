import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { resetTime, updateTime } from './timeSlice';
import { OpenSpaceTimeState } from './types';

const subscribeToTime = createAction<void>('time/subscribe');
const unsubscribeToTime = createAction<void>('time/unsubscribe');

let timeTopic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'time/setupSubscription',
  async (_, thunkAPI) => {
    timeTopic = api.startTopic('time', {
      event: 'start_subscription'
    });

    (async () => {
      for await (const data of timeTopic.iterator() as AsyncIterable<OpenSpaceTimeState>) {
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
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToTime,
    effect: (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
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

  startListening({
    actionCreator: onCloseConnection,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(resetTime());
    }
  });
};

export { subscribeToTime, unsubscribeToTime };
