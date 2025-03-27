import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskbarItemConfig } from '@/panels/Menu/types';
import { Uri } from '@/types/types';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

export interface LocalState {
  sceneTree: {
    expandedGroups: string[];
    currentlySelectedNode: Uri | null;
  };
  taskbarItems: TaskbarItemConfig[];
}

const initialState: LocalState = {
  sceneTree: {
    expandedGroups: [],
    currentlySelectedNode: null
  },
  taskbarItems: Object.values(menuItemsData).map((item) => {
    return {
      id: item.componentID,
      visible: item.defaultVisible,
      enabled: true,
      isOpen: false
    };
  })
};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    storeSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
      state.sceneTree.expandedGroups = action.payload;
      return state;
    },
    setSceneTreeSelectedNode: (state, action: PayloadAction<Uri | null>) => {
      state.sceneTree.currentlySelectedNode = action.payload;
      return state;
    },
    setMenuItemVisible: (
      state,
      action: PayloadAction<{ id: string; visible: boolean }>
    ) => {
      const item = state.taskbarItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.visible = action.payload.visible;
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
  storeSceneTreeNodeExpanded,
  setSceneTreeSelectedNode,
  setMenuItemVisible,
  setMenuItemEnabled,
  setMenuItemOpen,
  setMenuItemsOrder
} = localSlice.actions;
export const localReducer = localSlice.reducer;
