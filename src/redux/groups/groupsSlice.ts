import { TreeNodeData } from '@mantine/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Group } from '@/types/types';

export type Groups = {
  [key: string]: Group;
};

export type CustomGroupOrdering = {
  [key: string]: string[]; // group paths
};

export interface GroupsState {
  customGroupOrdering: CustomGroupOrdering;
  groups: Groups;
  sceneTreeData: TreeNodeData[];
  expandedGroups: string[];
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {}, // @TODO (emmbr, 2024-12-04): this could maybe be removed from the state
  sceneTreeData: [],
  expandedGroups: []
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    storeSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
      state.expandedGroups = action.payload;
      return state;
    },
    updateCustomGroupOrdering: (state, action: PayloadAction<CustomGroupOrdering>) => {
      state.customGroupOrdering = action.payload;
      return state;
    },
    setGroups: (state, action: PayloadAction<Groups>) => {
      state.groups = action.payload;
    },
    setSceneTreeData: (state, action: PayloadAction<TreeNodeData[]>) => {
      state.sceneTreeData = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  storeSceneTreeNodeExpanded,
  updateCustomGroupOrdering,
  setGroups,
  setSceneTreeData
} = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
