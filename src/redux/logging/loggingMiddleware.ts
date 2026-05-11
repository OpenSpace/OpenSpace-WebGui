import { notifications } from '@mantine/notifications';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LogLevel, LogMessage } from 'openspace-api-js/generated';
import { Topic } from 'openspace-api-js/topics';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { NotificationLevel } from '@/types/enums';
import { isReactNode } from '@/util/reactHelpers';

import { AppStartListening } from '../listenerMiddleware';
import { RootState } from '../store';

import { updateLogLevel } from './loggingSlice';

export const handleNotificationLogging = createAction(
  'logging/handleNotificationLogging',
  function prepare(title: string, message: unknown, level: NotificationLevel) {
    return {
      payload: {
        title,
        message,
        level
      }
    };
  }
);

let topic: Topic<'errorLog'> | null = null;

export const setupSubscription = createAsyncThunk(
  'logging/setupSubscription',
  async (level: LogLevel, thunkApi) => {
    topic = api.startTopic('errorLog', {
      event: 'start_subscription',
      settings: {
        logLevel: level,
        logLevelStamping: true,
        timeStamping: false,
        categoryStamping: true,
        dateStamping: false
      }
    });

    (async () => {
      for await (const message of topic) {
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

  if (level === undefined || !category) {
    return;
  }

  if (level === LogLevel.NoLogging) {
    return;
  }

  function logLevelToNotificationLevel(level: LogLevel): NotificationLevel {
    switch (level) {
      case LogLevel.Warning:
        return NotificationLevel.Warning;
      case LogLevel.Error:
      case LogLevel.Fatal:
        return NotificationLevel.Error;
      default:
        return NotificationLevel.Info;
    }
  }

  const logLevel = logLevelToNotificationLevel(level);

  internalHandleLogging(category, `${category}: ${message}`, logLevel, showNotification);
}

function notificationLevelToLogLevel(level: NotificationLevel): LogLevel {
  switch (level) {
    case NotificationLevel.Info:
      return LogLevel.Info;
    case NotificationLevel.Warning:
      return LogLevel.Warning;
    case NotificationLevel.Error:
      return LogLevel.Error;
    default:
      throw new Error(`Missing case exception '${level}'`);
  }
}

function internalHandleLogging(
  title: string,
  message: unknown,
  level: NotificationLevel,
  showNotification: boolean
) {
  const color = {
    [NotificationLevel.Info]: 'white',
    [NotificationLevel.Warning]: 'yellow',
    [NotificationLevel.Error]: 'red'
  };

  const log = {
    // eslint-disable-next-line no-console
    [NotificationLevel.Info]: console.log,
    // eslint-disable-next-line no-console
    [NotificationLevel.Warning]: console.warn,
    // eslint-disable-next-line no-console
    [NotificationLevel.Error]: console.error
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
          event: 'update_log_level',
          logLevel: notificationLevelToLogLevel(action.payload)
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
