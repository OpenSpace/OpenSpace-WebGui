import { createAction } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';
import { FlightControllerData } from 'src/types/types';

import { api } from '@/api/api';

import { onCloseConnection, onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

export const sendFlightControl = createAction<FlightControllerData>('sendFlightControl');

let flightControllerTopic: Topic | undefined;

export const addFlightControllerListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: () => {
      if (flightControllerTopic) {
        return;
      }
      const payload: FlightControllerData = {
        type: 'connect'
      };
      flightControllerTopic = api.startTopic('flightcontroller', payload);
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
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
