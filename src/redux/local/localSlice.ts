import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Uri } from '@/types/types';

export interface LocalState {
  sceneTree: {
    expandedGroups: string[];
    currentlySelectedNode: Uri | null;
  };
}

const initialState: LocalState = {
  sceneTree: {
    expandedGroups: [],
    currentlySelectedNode: null
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
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { storeSceneTreeNodeExpanded, setSceneTreeSelectedNode } =
  localSlice.actions;
export const localReducer = localSlice.reducer;
