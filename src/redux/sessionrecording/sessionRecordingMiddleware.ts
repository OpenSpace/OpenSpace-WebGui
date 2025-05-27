import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { setPropertyValue } from '../propertytree/properties/propertiesSlice';
import { RootState } from '../store';

import {
  SessionRecordingState,
  updateInitialRecordingSettings,
  updateSessionrecording
} from './sessionRecordingSlice';

const subscribeToSessionRecording = createAction<void>('sessionRecording/subscribe');
const unsubscribeToSessionRecording = createAction<void>('sessionRecording/unsubscribe');

let topic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'sessionRecording/setupSubscription',
  async (_, thunkAPI) => {
    topic = api.startTopic('sessionRecording', {
      event: 'start_subscription',
      properties: ['state', 'files']
    });
    (async () => {
      for await (const data of topic.iterator()) {
        thunkAPI.dispatch(updateSessionrecording(data));
      }
    })();
  }
);

export const showGUI = createAsyncThunk(
  'sessionRecording/showGUI',
  async (value: boolean, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { initialSettings, settings } = state.sessionRecording;

    const GuiUri = 'Modules.CefWebGui.Visible';
    const DashboardsUri = 'Dashboard.IsEnabled';
    const LogUri = 'RenderEngine.ShowLog';
    const VersionUri = 'RenderEngine.ShowVersion';

    // Get the initial property values before making any changes
    const gui = state.properties.properties[GuiUri]?.value as boolean | undefined;
    const dashboards = state.properties.properties[DashboardsUri]?.value as
      | boolean
      | undefined;
    const log = state.properties.properties[LogUri]?.value as boolean | undefined;
    const version = state.properties.properties[VersionUri]?.value as boolean | undefined;

    if (value === false) {
      if (
        log === undefined ||
        dashboards === undefined ||
        gui === undefined ||
        version === undefined
      ) {
        return;
      }
      // Before hiding GUI we need to store the initial values in store
      thunkAPI.dispatch(
        updateInitialRecordingSettings({
          showGui: gui,
          showDashboards: dashboards,
          showLog: log,
          showVersion: version
        })
      );

      if (settings.hideGuiOnPlayback) {
        thunkAPI.dispatch(setPropertyValue({ uri: GuiUri, value: false }));
      }

      if (settings.hideDashboardsOnPlayback) {
        thunkAPI.dispatch(setPropertyValue({ uri: DashboardsUri, value: false }));
        thunkAPI.dispatch(setPropertyValue({ uri: LogUri, value: false }));
        thunkAPI.dispatch(setPropertyValue({ uri: VersionUri, value: false }));
      }
    }

    if (value === true) {
      // Set GUI visibility to initial settings again
      if (settings.hideGuiOnPlayback) {
        thunkAPI.dispatch(
          setPropertyValue({
            uri: GuiUri,
            value: initialSettings.showGui
          })
        );
      }
      if (settings.hideDashboardsOnPlayback) {
        thunkAPI.dispatch(
          setPropertyValue({
            uri: DashboardsUri,
            value: initialSettings.showDashboards
          })
        );
        thunkAPI.dispatch(
          setPropertyValue({ uri: LogUri, value: initialSettings.showLog })
        );
        thunkAPI.dispatch(
          setPropertyValue({
            uri: VersionUri,
            value: initialSettings.showVersion
          })
        );
      }
    }
  }
);

// TODO (ylvse) 2024-12-02: This action is actually never used. In the previous repo we
// dispatched this when the session recording popover was closed.
// Now with the window system what to do?
export const refreshSessionRecording = createAsyncThunk(
  'sessionRecording/refresh',
  async (_, thunkAPI) => {
    if (topic) {
      topic.talk({
        event: 'refresh'
      });
    } else {
      // If we do not have a subscription, we need to create a new topic
      const tmpTopic = api.startTopic('sessionrecording', {
        event: 'refresh',
        properties: ['state', 'files']
      });
      (async () => {
        const data = (await tmpTopic
          .iterator()
          .next()) as unknown as SessionRecordingState;
        thunkAPI.dispatch(updateSessionrecording(data));
        tmpTopic.cancel();
      })();
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
