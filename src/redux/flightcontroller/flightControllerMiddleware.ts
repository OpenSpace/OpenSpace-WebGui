import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';
import {
  FlightControllerCommand,
  FlightControllerConnectCommand,
  FlightControllerDisconnectCommand
} from 'openspace-api-js/types';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

export const sendFlightControl =
  createAction<FlightControllerCommand>('sendFlightControl');

let flightControllerTopic: Topic<'flightcontroller'> | undefined = undefined;

export const setupTopic = createAsyncThunk('flightcontroller/setupTopic', async () => {
  if (flightControllerTopic) {
    return;
  }
  const payload: FlightControllerConnectCommand = {
    event: 'connect'
  };
  flightControllerTopic = api.startTopic('flightcontroller', payload);
});

function tearDownTopic() {
  if (!flightControllerTopic) {
    return;
  }
  const payload: FlightControllerDisconnectCommand = {
    event: 'disconnect'
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
