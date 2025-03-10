import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskbarItemConfig } from '@/panels/Menu/types';
import { Uri } from '@/types/types';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

export interface LocalState {
  sceneTree: {
    expandedGroups: string[];
    currentlySelectedNode: Uri | null;
  };
  menu: {
    items: TaskbarItemConfig[];
  };
}

const initialState: LocalState = {
  sceneTree: {
    expandedGroups: [],
    currentlySelectedNode: null
  },
  menu: {
    items: Object.values(menuItemsData).map((item) => {
      return { id: item.componentID, visible: item.defaultVisible, enabled: true };
    })
  }
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
    setVisibleMenuItems: (
      state,
      action: PayloadAction<{ id: string; visible: boolean }>
    ) => {
      const item = state.menu.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.visible = action.payload.visible;
      }
      return state;
    },
    setEnabledMenuItems: (
      state,
      action: PayloadAction<{ id: string; enabled: boolean }>
    ) => {
      const item = state.menu.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.enabled = action.payload.enabled;
      }
      return state;
    },
    updateMenuItemsOrder: (state, action: PayloadAction<TaskbarItemConfig[]>) => {
      state.menu.items = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  storeSceneTreeNodeExpanded,
  setSceneTreeSelectedNode,
  setVisibleMenuItems,
  setEnabledMenuItems,
  updateMenuItemsOrder
} = localSlice.actions;
export const localReducer = localSlice.reducer;
