import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Groups } from '@/types/types';

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
    },
    setGroups: (state, action: PayloadAction<Groups>) => {
      state.groups = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateCustomGroupOrdering, setGroups } = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
