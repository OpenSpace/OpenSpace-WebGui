import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { DownloadEventNotificationBody } from '@/components/Notifications/DownloadEventNotificationBody';
import i18n from '@/localization/config';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { RootState } from '@/redux/store';
import { ConnectionStatus } from '@/types/enums';
import { roundTo } from '@/util/numeric';

import { DownloadEvent, DownloadType } from './types';

let topic: Topic | null = null;
let isSubscribed = false;

// Stores the URL and a corresponding ID mapped to the notification system
const downloads: Record<string, string> = {};

export const setupDownloadEventSubcription = createAsyncThunk(
  'downloadEvent/setupSubscription',
  async (_, thunkApi) => {
    topic = api.startTopic('downloadEvent', {
      event: 'start_subscription'
    });

    (async () => {
      for await (const data of topic.iterator() as AsyncIterable<DownloadEvent>) {
        const { showNotifications } = (thunkApi.getState() as RootState).logging;

        // Ignore download notifications if user has disabled them
        if (!showNotifications) {
          continue;
        }

        const downloadedMb = data.downloadedBytes / (1024 * 1024);
        const totalMb = data.totalBytes ? data.totalBytes / (1024 * 1024) : -1;

        if (data.type === DownloadType.Finished || data.type === DownloadType.Failed) {
          const isFinished = data.type === DownloadType.Finished;

          const title = isFinished
            ? i18n.t('download-event.title.finished', { ns: 'notifications' })
            : i18n.t('download-event.title.failed', { ns: 'notifications' });
          const message = isFinished
            ? i18n.t('download-event.message.finished', {
                ns: 'notifications',
                file: data.id
              })
            : i18n.t('download-event.message.failed', {
                ns: 'notifications',
                file: data.id
              });

          const color = isFinished ? 'green' : 'red';

          notifications.update({
            id: downloads[data.id],
            title: title,
            message: (
              <DownloadEventNotificationBody
                message={message}
                downloadProgress={isFinished ? 100 : 50}
                color={color}
                animated={false}
              />
            ),
            autoClose: true,
            loading: false,
            color: color
          });

          delete downloads[data.id];
        }

        if (data.type === DownloadType.Started && !downloads[data.id]) {
          notifications.show({
            id: data.id,
            title: i18n.t('download-event.title.started', {
              ns: 'notifications',
              file: data.id
            }),
            message: (
              <DownloadEventNotificationBody
                message={i18n.t('download-event.message.started', {
                  ns: 'notifications',
                  file: data.id
                })}
                downloadProgress={0}
              />
            ),
            autoClose: false,
            loading: true,
            color: 'white'
          });
          downloads[data.id] = data.id;
        }

        if (data.type === DownloadType.Progress) {
          if (downloads[data.id]) {
            notifications.update({
              id: data.id,
              title: i18n.t('download-event.title.progress', {
                ns: 'notifications',
                file: data.id
              }),
              message: (
                <DownloadEventNotificationBody
                  message={i18n.t('download-event.message.progress', {
                    ns: 'notifications',
                    bytes: roundTo(downloadedMb, 2),
                    total: roundTo(totalMb, 2)
                  })}
                  downloadProgress={(downloadedMb / totalMb) * 100}
                />
              ),
              autoClose: false,
              loading: true,
              color: 'white'
            });
          } else {
            // We've already started downloading but frontend may not have been connected
            // yet, or Gui was refreshed during download
            notifications.show({
              id: data.id,
              title: i18n.t('download-event.title.progress', {
                ns: 'notifications',
                file: data.id
              }),
              message: (
                <DownloadEventNotificationBody
                  message={i18n.t('download-event.message.progress', {
                    ns: 'notifications',
                    bytes: roundTo(downloadedMb, 2),
                    total: roundTo(totalMb, 2)
                  })}
                  downloadProgress={(downloadedMb / totalMb) * 100}
                />
              ),
              autoClose: false,
              loading: true,
              color: 'white'
            });
            downloads[data.id] = data.id;
          }
        }
      }
    })();
  }
);

function teardownSubscription() {
  if (!topic) {
    return;
  }

  topic.talk({
    event: 'stop_subscription'
  });
  topic.cancel();
  topic = null;
  isSubscribed = false;
}

export const addDownloadEventListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      const { connectionStatus } = listenerApi.getState().connection;
      if (!isSubscribed && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupDownloadEventSubcription());
        isSubscribed = true;
      }
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: async (_, listenerApi) => {
      const { connectionStatus } = listenerApi.getState().connection;
      if (isSubscribed && connectionStatus === ConnectionStatus.Connected) {
        teardownSubscription();
      }
    }
  });
};
