import { notifications } from '@mantine/notifications';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { DownloadEventNotificationBody } from '@/components/Notifications/DownloadEventNotificationBody';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { CheckIcon, ErrorIcon } from '@/icons/icons';
import i18n from '@/localization/config';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { RootState } from '@/redux/store';
import { ConnectionStatus, IconSize } from '@/types/enums';

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

        const megabyte = 1024 * 1024;
        const downloadedMb = data.downloadedBytes / megabyte;
        const totalMb = data.totalBytes ? data.totalBytes / megabyte : -1;

        switch (data.type) {
          case DownloadType.Finished: {
            notifications.update({
              id: downloads[data.id],
              title: i18n.t('download-event.title.finished', { ns: 'notifications' }),
              message: (
                <TruncatedText>
                  {i18n.t('download-event.message.finished', {
                    ns: 'notifications',
                    file: data.id
                  })}
                </TruncatedText>
              ),
              icon: <CheckIcon size={IconSize.sm} />,
              autoClose: true,
              loading: false,
              color: 'green'
            });
            delete downloads[data.id];
            break;
          }
          case DownloadType.Failed: {
            const color = 'red';

            notifications.update({
              id: downloads[data.id],
              title: i18n.t('download-event.title.failed', { ns: 'notifications' }),
              message: (
                <DownloadEventNotificationBody
                  message={i18n.t('download-event.message.failed', {
                    ns: 'notifications',
                    file: data.id
                  })}
                  downloadProgress={50}
                  color={color}
                  animated={false}
                />
              ),
              icon: <ErrorIcon size={IconSize.sm} />,
              autoClose: true,
              loading: false,
              color: color
            });

            delete downloads[data.id];
            break;
          }
          case DownloadType.Started: {
            if (!downloads[data.id]) {
              downloads[data.id] = data.id;

              notifications.show({
                id: downloads[data.id],
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
            }
            break;
          }
          case DownloadType.Progress: {
            const notificationData = {
              id: '',
              title: i18n.t('download-event.title.progress', {
                ns: 'notifications',
                file: data.id
              }),
              message: (
                <DownloadEventNotificationBody
                  message={i18n.t('download-event.message.progress', {
                    ns: 'notifications',
                    file: data.id
                  })}
                  downloadedSize={downloadedMb}
                  totalSize={totalMb}
                />
              ),
              autoClose: false,
              loading: true,
              color: 'white'
            };

            if (downloads[data.id]) {
              notificationData.id = downloads[data.id];
              notifications.update(notificationData);
            } else {
              // We've already started downloading but frontend may not have been connected
              // yet, or Gui was refreshed during download
              downloads[data.id] = data.id;
              notificationData.id = data.id;
              notifications.show(notificationData);
            }
            break;
          }
          default:
            throw new Error(`Unknown download event type: ${data.type}`);
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
