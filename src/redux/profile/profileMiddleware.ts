import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { setMenuItemVisible } from '@/redux/local/localSlice';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';

import { ProfileState, setProfileData } from './profileSlice';

export const getProfile = createAsyncThunk('profile/getProfile', async () => {
  const topic = api.startTopic('profile', {});
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value as ProfileState;
});

export const addProfileListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getProfile());
    }
  });

  startListening({
    actionCreator: getProfile.fulfilled,
    effect: async (action, listenerApi) => {
      // Get the data from the profile topic and set it in the redux store

      // Panel visibility settings
      Object.entries(action.payload.uiPanelVisibility).forEach(([key, value]) => {
        const { menuItemsConfig } = listenerApi.getState().local;
        const item = menuItemsConfig.find((item) => item.id === key);

        if (item) {
          listenerApi.dispatch(setMenuItemVisible({ id: key, visible: value }));
        } else {
          listenerApi.dispatch(
            handleNotificationLogging(
              'Error missing menu item',
              `Tried to set visibility of non-existent menu item: '${key}'`,
              LogLevel.Error
            )
          );
        }
      });

      // Store the profile data in the slice
      listenerApi.dispatch(setProfileData(action.payload));
    }
  });
};
