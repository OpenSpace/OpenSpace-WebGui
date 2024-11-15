import { createAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { OpenSpaceTimeState } from '@/types/types';

import { updateTime } from './timeSlice';

const subscribeToTime = createAction<void>('subscribeToTime');
const unsubscribeToTime = createAction<void>('unsubscribeToTime');

let timeTopic: Topic;
let nSubscribers = 0;

function handleData(dispatch: Dispatch<UnknownAction>, data: OpenSpaceTimeState) {
  dispatch(updateTime(data));
}

function setupSubscription(dispatch: Dispatch<UnknownAction>) {
  timeTopic = api.startTopic('time', {
    event: 'start_subscription'
  });
  (async () => {
    for await (const data of timeTopic.iterator()) {
      handleData(dispatch, data as OpenSpaceTimeState);
    }
  })();
}

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
    effect: (_, api) => {
      if (nSubscribers > 0) {
        setupSubscription(api.dispatch);
      }
    }
  });

  startListening({
    actionCreator: subscribeToTime,
    effect: (_, api) => {
      ++nSubscribers;
      const { isConnected } = api.getState().connection;
      if (nSubscribers === 1 && isConnected) {
        setupSubscription(api.dispatch);
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
