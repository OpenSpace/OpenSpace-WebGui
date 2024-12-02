import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { FlightControllerData } from '@/types/flightcontroller-types';

export const sendFlightControl = createAction<FlightControllerData>('sendFlightControl');

let flightControllerTopic: Topic | undefined = undefined;

export const setupSubscription = createAsyncThunk(
  'flightcontroller/setupSubscription',
  async () => {
    if (flightControllerTopic) {
      return;
    }
    const payload: FlightControllerData = {
      type: 'connect'
    };
    flightControllerTopic = api.startTopic('flightcontroller', payload);
  }
);

function tearDownSubscription() {
  if (!flightControllerTopic) {
    return;
  }
  const payload: FlightControllerData = {
    type: 'disconnect'
  };
  flightControllerTopic.talk(payload);
  flightControllerTopic.cancel();
  flightControllerTopic = undefined;
}

export const addFlightControllerListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(setupSubscription());
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      tearDownSubscription();
    }
  });

  startListening({
    actionCreator: sendFlightControl,
    effect: (action) => {
      if (!flightControllerTopic) {
        return;
      }
      flightControllerTopic.talk(action.payload);
    }
  });
};
