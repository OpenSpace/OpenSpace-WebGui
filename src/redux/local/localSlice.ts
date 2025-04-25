import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskbarItemConfig } from '@/panels/Menu/types';
import { Uri } from '@/types/types';

import { createDefaultTaskbar } from './util';

export interface LocalState {
  menus: {
    navigation: {
      // Whether to show non-focusable nodes in the navigation menu search results
      onlyFocusable: boolean;
    };
  };
  sceneTree: {
    expandedGroups: string[];
    currentlySelectedNode: Uri | null;
  };
  taskbarItems: TaskbarItemConfig[];
}

const initialState: LocalState = {
  menus: {
    navigation: {
      onlyFocusable: true
    }
  },
  // @TODO: (emmbr 2025-04-09): Consider moving this to the menus object above. did not
  // want to do it as of now to avoid PR conflicts
  sceneTree: {
    expandedGroups: [],
    currentlySelectedNode: null
  },
  taskbarItems: createDefaultTaskbar()
};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    resetTaskbarItems: (state) => {
      state.taskbarItems = createDefaultTaskbar();
      return state;
    },
    storeSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
      state.sceneTree.expandedGroups = action.payload;
      return state;
    },
    setSceneTreeSelectedNode: (state, action: PayloadAction<Uri | null>) => {
      state.sceneTree.currentlySelectedNode = action.payload;
      return state;
    },
    setOnlyFocusableInNavMenu: (state, action: PayloadAction<boolean>) => {
      state.menus.navigation.onlyFocusable = action.payload;
      return state;
    },
    setMenuItemVisible: (
      state,
      action: PayloadAction<{ id: string; visible: boolean }>
    ) => {
      const item = state.taskbarItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.visible = action.payload.visible;
      } else {
        // @TODO (ylvse 2025-03-31): handle this error with the notification system?
        console.error(
          'Tried to set visibility of non-existent menu item',
          action.payload.id
        );
      }
      return state;
    },
    setMenuItemEnabled: (
      state,
      action: PayloadAction<{ id: string; enabled: boolean }>
    ) => {
      const item = state.taskbarItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.enabled = action.payload.enabled;
      }
      return state;
    },
    setMenuItemOpen: (state, action: PayloadAction<{ id: string; open: boolean }>) => {
      const item = state.taskbarItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.isOpen = action.payload.open;
      }
      return state;
    },
    setMenuItemsOrder: (state, action: PayloadAction<TaskbarItemConfig[]>) => {
      state.taskbarItems = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  resetTaskbarItems,
  storeSceneTreeNodeExpanded,
  setSceneTreeSelectedNode,
  setOnlyFocusableInNavMenu,
  setMenuItemVisible,
  setMenuItemEnabled,
  setMenuItemOpen,
  setMenuItemsOrder
} = localSlice.actions;
export const localReducer = localSlice.reducer;
