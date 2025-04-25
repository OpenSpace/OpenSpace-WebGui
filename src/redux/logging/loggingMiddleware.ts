import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { LogLevel } from '@/types/enums';
import { showNotification } from '@/util/logging';

import { onCloseConnection, onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

let topic: Topic | null = null;

export const setupSubscription = createAsyncThunk(
  'logging/setupSubscription',
  async () => {
    topic = api.startTopic('errorLog', {
      event: 'start_subscription',
      settings: {
        timeStamping: false,
        dateStamping: false,
        categoryStamping: true,
        logLevelStamping: true,
        logLevel: 'Warning'
      }
    });

    (async () => {
      for await (const message of topic.iterator() as AsyncIterable<string>) {
        parseLogMessage(message);
      }
    })();
  }
);

function unsubscribe() {
  if (!topic) {
    return;
  }

  topic.talk({
    event: 'stop_subscription'
  });
  topic.cancel();
  topic = null;
}

function parseLogMessage(message: string) {
  const destructuredMessage = message.split(/[\t]+/);
  const [category, level, ...msg] = destructuredMessage;

  function getLogLevel(): LogLevel {
    if (level === '(Warning)') {
      return LogLevel.Warning;
    }
    if (level === '(Error)') {
      return LogLevel.Error;
    }
    return LogLevel.Info;
  }
  const logLevel = getLogLevel();

  showNotification(category, `${category}: ${msg.join(' ')}`, logLevel);
}

export const addLoggingListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (!topic) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: async () => {
      if (topic) {
        unsubscribe();
      }
    }
  });
};
