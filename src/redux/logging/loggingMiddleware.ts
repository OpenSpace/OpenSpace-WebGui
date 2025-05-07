import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { LogLevel } from '@/types/enums';
import { showNotification } from '@/util/logging';

import { onCloseConnection, onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

let topic: Topic | null = null;

/**
 * This `LogLevel` must match OpenSpace/Ghoul LogLevel in
 * https://github.com/OpenSpace/Ghoul/blob/f02810ad2f77166711f4503060e20745f0d808c6/include/ghoul/logging/loglevel.h#L41
 */
enum OpenSpaceLogLevel {
  AllLogging = 0,
  Trace = 1,
  Debug = 2,
  Info = 3,
  Warning = 4,
  Error = 5,
  Fatal = 6,
  NoLogging = 7
}

type LogMessage = {
  level: OpenSpaceLogLevel;
  category: string;
  message: string;
  timeStamp: string;
  dateStamp: string;
};

export const setupSubscription = createAsyncThunk(
  'logging/setupSubscription',
  async () => {
    topic = api.startTopic('errorLog', {
      event: 'start_subscription',
      settings: {
        logLevel: 'Warning'
      }
    });

    (async () => {
      for await (const message of topic.iterator() as AsyncIterable<LogMessage>) {
        logNotificationMessage(message);
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

function logNotificationMessage(logMessage: LogMessage) {
  const { category, level, message } = logMessage;

  if (level === OpenSpaceLogLevel.NoLogging) {
    return;
  }

  function getLogLevel(): LogLevel {
    switch (level) {
      case OpenSpaceLogLevel.Warning:
        return LogLevel.Warning;
      case OpenSpaceLogLevel.Error:
      case OpenSpaceLogLevel.Fatal:
        return LogLevel.Error;
      default:
        return LogLevel.Info;
    }
  }

  const logLevel = getLogLevel();

  showNotification(category, `${category}: ${message}`, logLevel);
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
