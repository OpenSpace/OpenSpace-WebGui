import { TreeNodeData } from '@mantine/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CustomGroupOrdering, Groups } from '@/types/types';

export interface GroupsState {
  customGroupOrdering: CustomGroupOrdering;
  groups: Groups;
  sceneTreeData: TreeNodeData[];
  tags: string[];
  expandedGroups: string[];
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {},
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
      return state;
    },
    setSceneTreeData: (state, action: PayloadAction<TreeNodeData[]>) => {
      state.sceneTreeData = action.payload;
      return state;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
      return state;
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
