import { createAction } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { FlightControllerData } from '@/types/flightcontroller-types';

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
