import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { actionsTestData } from './actionsTestData';

interface Shortcut {
  action: string;
  key: string;
  modifiers: {
    alt: boolean;
    control: boolean;
    shift: boolean;
    super: boolean;
  };
}

export interface Action {
  identifier: string;
  guiPath: string;
  name: string;
  synchronization: boolean;
  documentation: string;
}

export interface ActionsState {
  isInitialized: boolean;
  navigationPath: string;
  data: Action[];
  showKeybinds: boolean;
}

const initialState: ActionsState = {
  isInitialized: true,
  navigationPath: '/',
  data: actionsTestData,
  showKeybinds: false
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    initializeShortcuts: (state, action: PayloadAction<Action[]>) => {
      return {
        ...state,
        isInitialized: true,
        data: action.payload
      };
    },
    setActionsPath: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        navigationPath: action.payload
      };
    },
    toggleKeybindViewer: (state) => {
      return {
        ...state,
        showKeybinds: !state.showKeybinds
      };
    },
    addActions: (state, action: PayloadAction<Action[]>) => {
      return {
        ...state,
        data: [...state.data, ...action.payload]
      };
    },
    removeAction: (state, action: PayloadAction<string>) => {
      const newData = state.data;
      const index = newData.findIndex((element) => element.identifier === action.payload);
      if (index > -1) {
        // only splice array when item is found
        newData.splice(index, 1); // 2nd parameter means remove one item only
      }
      // If the removed action was the last one with its gui path, we need to change the
      // navigation path
      const indexPath = newData.findIndex(
        (element) => element.guiPath === state.navigationPath
      );
      const newNavigationPath = indexPath < 0 ? '/' : state.navigationPath;
      return {
        ...state,
        data: [...newData],
        navigationPath: newNavigationPath
      };
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  initializeShortcuts,
  setActionsPath,
  toggleKeybindViewer,
  addActions,
  removeAction
} = actionsSlice.actions;

export const actionsReducer = actionsSlice.reducer;
