import { AppStartListening } from '../listenerMiddleware';
import { reloadPropertyTree } from '../propertytree/propertyTreeMiddleware';

import { addShowcomposerBookmark } from './userPanelsSlice';

export const addUserPanelsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: reloadPropertyTree,
    effect: (_, listenerApi) => {
      const { properties } = listenerApi.getState().properties;
      const port = properties['Modules.WebGui.Port']?.value ?? 4680;
      const address = properties['Modules.WebGui.Address']?.value ?? 'localhost';
      listenerApi.dispatch(
        addShowcomposerBookmark({ address: address as string, port: port as number })
      );
    }
  });
};
