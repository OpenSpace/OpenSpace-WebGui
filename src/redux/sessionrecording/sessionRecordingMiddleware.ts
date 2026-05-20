import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { propertySelectors } from '../propertytree/propertySlice';
import { setPropertyValue } from '../propertytree/propertyTreeMiddleware';
import { RootState } from '../store';

import {
  updateInitialRecordingSettings,
  updateSessionrecording
} from './sessionRecordingSlice';

const subscribeToSessionRecording = createAction<void>('sessionRecording/subscribe');
const unsubscribeToSessionRecording = createAction<void>('sessionRecording/unsubscribe');

let topic: Topic<'sessionRecording'>;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'sessionRecording/setupSubscription',
  async (_, thunkAPI) => {
    topic = api.startTopic('sessionRecording', {
      event: 'start_subscription',
      properties: ['state', 'files']
    });
    (async () => {
      for await (const data of topic) {
        thunkAPI.dispatch(updateSessionrecording(data));
      }
    })();
  }
);

export const showGUI = createAsyncThunk(
  'sessionRecording/showGUI',
  async (shouldShowGui: boolean, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { initialSettings, settings } = state.sessionRecording;
    const properties = propertySelectors.selectEntities(state);

    const ShowGuiUri = 'Modules.CefWebGui.Visible';
    const ShowDashboardsUri = 'Dashboard.IsEnabled';
    const ShowLogUri = 'RenderEngine.ShowLog';
    const ShowVersionUri = 'RenderEngine.ShowVersion';

    // Get the initial property values before making any changes
    const showGui = properties[ShowGuiUri]?.value as boolean | undefined;
    const showDashboards = properties[ShowDashboardsUri]?.value as boolean | undefined;
    const showLog = properties[ShowLogUri]?.value as boolean | undefined;
    const showVersion = properties[ShowVersionUri]?.value as boolean | undefined;

    if (!shouldShowGui) {
      if (
        showLog === undefined ||
        showDashboards === undefined ||
        showGui === undefined ||
        showVersion === undefined
      ) {
        return;
      }
      // Before hiding GUI we need to store the initial values in store
      thunkAPI.dispatch(
        updateInitialRecordingSettings({
          showGui: showGui,
          showDashboards: showDashboards,
          showLog: showLog,
          showVersion: showVersion
        })
      );

      // Hide Gui
      if (settings.hideGuiOnPlayback) {
        thunkAPI.dispatch(setPropertyValue({ uri: ShowGuiUri, value: false }));
      }

      if (settings.hideDashboardsOnPlayback) {
        thunkAPI.dispatch(setPropertyValue({ uri: ShowDashboardsUri, value: false }));
        thunkAPI.dispatch(setPropertyValue({ uri: ShowLogUri, value: false }));
        thunkAPI.dispatch(setPropertyValue({ uri: ShowVersionUri, value: false }));
      }
    } else {
      // Set GUI visibility to initial settings again
      if (settings.hideGuiOnPlayback) {
        thunkAPI.dispatch(
          setPropertyValue({
            uri: ShowGuiUri,
            value: initialSettings.showGui
          })
        );
      }
      if (settings.hideDashboardsOnPlayback) {
        thunkAPI.dispatch(
          setPropertyValue({
            uri: ShowDashboardsUri,
            value: initialSettings.showDashboards
          })
        );
        thunkAPI.dispatch(
          setPropertyValue({ uri: ShowLogUri, value: initialSettings.showLog })
        );
        thunkAPI.dispatch(
          setPropertyValue({
            uri: ShowVersionUri,
            value: initialSettings.showVersion
          })
        );
      }
    }
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
}

export const addSessionRecordingListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToSessionRecording,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToSessionRecording,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};

export { subscribeToSessionRecording, unsubscribeToSessionRecording };
