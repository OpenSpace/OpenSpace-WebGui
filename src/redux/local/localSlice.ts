import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MenuItemConfig } from '@/panels/Menu/types';
import { Identifier, Uri, Visibility } from '@/types/types';

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
    visibility: Record<Uri, Visibility | undefined>;
  };
  menuItems: {
    config: MenuItemConfig[];
    toolbarOrder: Identifier[];
  };
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
    currentlySelectedNode: null,
    visibility: {}
  },
  menuItems: {
    config: [],
    toolbarOrder: []
  }
};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setSceneGraphNodesVisibility: (
      state,
      action: PayloadAction<Record<Uri, Visibility | undefined>>
    ) => {
      Object.assign(state.sceneTree.visibility, action.payload);
      return state;
    },
    removeSceneGraphNode: (state, action: PayloadAction<Uri>) => {
      delete state.sceneTree.visibility[action.payload];
      return state;
    },
    setVisibility: (
      state,
      action: PayloadAction<{ uri: Uri; visibility: Visibility }>
    ) => {
      state.sceneTree.visibility[action.payload.uri] = action.payload.visibility;
      return state;
    },
    setSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
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
      const item = state.menuItems.config.find((item) => item.id === action.payload.id);
      if (item) {
        item.visible = action.payload.visible;
      }
      return state;
    },
    setMenuItemOpen: (state, action: PayloadAction<{ id: string; open: boolean }>) => {
      const item = state.menuItems.config.find((item) => item.id === action.payload.id);
      if (item) {
        item.isOpen = action.payload.open;
      }
      return state;
    },
    setMenuItemsConfig: (state, action: PayloadAction<MenuItemConfig[]>) => {
      state.menuItems.config = action.payload;
      // We need to update the order when a new config has been set
      state.menuItems.toolbarOrder = action.payload.map((item) => item.id);
      return state;
    },
    setMenuItemsOrder: (state, action: PayloadAction<Identifier[]>) => {
      state.menuItems.toolbarOrder = action.payload;
      return state;
    }
  }
});

export const {
  setSceneTreeNodeExpanded,
  setSceneTreeSelectedNode,
  setOnlyFocusableInNavMenu,
  setMenuItemVisible,
  setMenuItemOpen,
  setMenuItemsConfig,
  setVisibility,
  setSceneGraphNodesVisibility,
  removeSceneGraphNode,
  setMenuItemsOrder
} = localSlice.actions;
export const localReducer = localSlice.reducer;
