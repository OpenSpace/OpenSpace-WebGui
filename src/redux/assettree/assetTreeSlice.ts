type Path = string;
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PathList, State, StateSnapshot } from 'openspace-api-js/types';

import { AssetLoadingState } from '@/panels/AssetsPanel/types';

export interface AssetTreeState {
  shipped: Path[];
  user: Path[];
  other: Path[];
  rootAssets: Path[];
  states: Record<Path, AssetLoadingState>;
}

const initialState: AssetTreeState = {
  shipped: [],
  user: [],
  other: [],
  rootAssets: [],
  states: {}
};

export const assetTreeSlice = createSlice({
  name: 'assetTree',
  initialState,
  reducers: {
    updatePathList: (state, action: PayloadAction<PathList>) => {
      state[action.payload.category] = action.payload.paths.sort((a, b) =>
        a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
      );
    },
    updateStatesSnapshot: (state, action: PayloadAction<StateSnapshot>) => {
      state.states = action.payload.states;
    },
    updateAssetState: (state, action: PayloadAction<State>) => {
      state.states[action.payload.path] = action.payload.state;
    }
  }
});

export const { updatePathList, updateStatesSnapshot, updateAssetState } =
  assetTreeSlice.actions;
export const assetTreeReducer = assetTreeSlice.reducer;
