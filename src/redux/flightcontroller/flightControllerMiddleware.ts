import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { FlightControllerData } from '@/panels/FlightControlPanel/types';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

export const sendFlightControl = createAction<FlightControllerData>('sendFlightControl');

let flightControllerTopic: Topic | undefined = undefined;

export const setupTopic = createAsyncThunk('flightcontroller/setupTopic', async () => {
  if (flightControllerTopic) {
    return;
  }
  const payload: FlightControllerData = {
    type: 'connect'
  };
  flightControllerTopic = api.startTopic('flightcontroller', payload);
});

function tearDownTopic() {
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
      listenerApi.dispatch(setupTopic());
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      tearDownTopic();
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
