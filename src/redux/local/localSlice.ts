import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocalState {
  sceneTree: {
    expandedGroups: string[];
  };
}

const initialState: LocalState = {
  sceneTree: {
    expandedGroups: []
  }
};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    storeSceneTreeNodeExpanded: (state, action: PayloadAction<string[]>) => {
      state.sceneTree.expandedGroups = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { storeSceneTreeNodeExpanded } = localSlice.actions;
export const localReducer = localSlice.reducer;
