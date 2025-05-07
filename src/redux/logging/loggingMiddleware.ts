import { notifications } from '@mantine/notifications';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { LogLevel } from '@/types/enums';
import { isReactNode } from '@/util/reactHelpers';

import { AppStartListening } from '../listenerMiddleware';
import { RootState } from '../store';

import { updateLogLevel } from './loggingSlice';

export const handleNotificationLogging = createAction(
  'logging/handleNotificationLogging',
  function prepare(title: string, message: unknown, level: LogLevel) {
    return {
      payload: {
        title,
        message,
        level
      }
    };
  }
);

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
  async (level: LogLevel, thunkApi) => {
    topic = api.startTopic('errorLog', {
      event: 'start_subscription',
      settings: {
        logLevel: level
      }
    });

    (async () => {
      for await (const message of topic.iterator() as AsyncIterable<LogMessage>) {
        const { showNotifications } = (thunkApi.getState() as RootState).logging;

        logNotificationMessage(message, showNotifications);
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

function logNotificationMessage(logMessage: LogMessage, showNotification: boolean) {
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

  internalHandleLogging(category, `${category}: ${message}`, logLevel, showNotification);
}

function internalHandleLogging(
  title: string,
  message: unknown,
  level: LogLevel,
  showNotification: boolean
) {
  const color = {
    [LogLevel.Info]: 'white',
    [LogLevel.Warning]: 'yellow',
    [LogLevel.Error]: 'red'
  };

  const log = {
    // eslint-disable-next-line no-console
    [LogLevel.Info]: console.log,
    // eslint-disable-next-line no-console
    [LogLevel.Warning]: console.warn,
    // eslint-disable-next-line no-console
    [LogLevel.Error]: console.error
  };

  if (isReactNode(message) && showNotification) {
    notifications.show({
      title: title,
      message: message,
      color: color[level]
    });
  }

  log[level](message);
}

export const addLoggingListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (!topic) {
        // By default we subscribe to "Warning" messages and above
        listenerApi.dispatch(setupSubscription(LogLevel.Warning));
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

  startListening({
    actionCreator: updateLogLevel,
    effect: async (action) => {
      if (topic) {
        topic.talk({
          event: 'update_logLevel',
          logLevel: action.payload
        });
      }
    }
  });

  startListening({
    actionCreator: handleNotificationLogging,
    effect: (action, listenerApi) => {
      const { title, message, level } = action.payload;

      internalHandleLogging(
        title,
        message,
        level,
        listenerApi.getState().logging.showNotifications
      );
    }
  });
};
