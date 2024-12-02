import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Groups } from '@/types/types';

import { refreshGroups } from './groupsSliceMiddleware';

export interface GroupsState {
  customGroupOrdering: object; // TODO specify this
  groups: Groups;
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {}
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    updateCustomGroupOrdering: (
      state,
      action: PayloadAction<object> // TODO: make a type?
    ) => {
      state.customGroupOrdering = action.payload;
      // Alternatively:
      // return {
      //   ...state,
      //   customGroupOrdering: action.payload
      // }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(refreshGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateCustomGroupOrdering } = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
