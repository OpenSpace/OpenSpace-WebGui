import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { EngineMode } from '@/types/enums';

export interface EngineModeState {
  mode: EngineMode;
}

const initialState: EngineModeState = {
  mode: EngineMode.UserControl
};

export const engineModeSlice = createSlice({
  name: 'engineMode',
  initialState,
  reducers: {
    updateEngineMode: (state, action: PayloadAction<EngineModeState>) => {
      state.mode = action.payload.mode;
      return state;
    }
  }
});

export const { updateEngineMode } = engineModeSlice.actions;
export const engineModeReducer = engineModeSlice.reducer;
