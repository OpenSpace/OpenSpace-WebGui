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
  tags: string[];
  expandedGroups: string[];
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {}, // @TODO (emmbr, 2024-12-04): this could maybe be removed from the state
  sceneTreeData: [],
  tags: [],
  expandedGroups: []
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    updateCustomGroupOrdering: (state, action: PayloadAction<CustomGroupOrdering>) => {
      state.customGroupOrdering = action.payload;
      return state;
    },
    setGroups: (state, action: PayloadAction<Groups>) => {
      state.groups = action.payload;
    },
    setSceneTreeData: (state, action: PayloadAction<TreeNodeData[]>) => {
      state.sceneTreeData = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    storeSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
      state.expandedGroups = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  updateCustomGroupOrdering,
  setGroups,
  setSceneTreeData,
  setTags,
  storeSceneTreeNodeExpanded
} = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
