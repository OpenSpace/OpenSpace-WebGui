import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Action, Keybind } from '@/types/types';

import { getAction, getAllActions } from './actionsMiddleware';

export interface ActionsState {
  isInitialized: boolean;
  navigationPath: string;
  actions: Action[];
  keybinds: Keybind[];
  showKeybinds: boolean;
}

const initialState: ActionsState = {
  isInitialized: true,
  navigationPath: '/',
  actions: [],
  keybinds: [],
  showKeybinds: false
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
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
    removeAction: (state, action: PayloadAction<string>) => {
      const index = state.actions.findIndex(
        (element) => element.identifier === action.payload
      );
      if (index > -1) {
        // only splice array when item is found
        state.actions.splice(index, 1); // 2nd parameter means remove one item only
      }
      // If the removed action was the last one with its gui path, we need to change the
      // navigation path
      const indexPath = state.actions.findIndex(
        (element) => element.guiPath === state.navigationPath
      );
      if (indexPath === -1) {
        state.navigationPath = '/';
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllActions.fulfilled,
      (state, action: PayloadAction<{ actions: Action[]; keybinds: Keybind[] }>) => {
        const { actions, keybinds } = action.payload;
        const modifiedKeybinds: Keybind[] = keybinds.map((keybind) => {
          const modifiers = Object.values(keybind.modifiers)
            .map((value, i) => (value ? Object.keys(keybind.modifiers)[i] : null))
            .filter((value) => value !== null) as Keybind['modifiers'];

          return {
            action: keybind.action,
            key: keybind.key,
            modifiers: modifiers
          };
        });

        state.isInitialized = true;
        state.keybinds = modifiedKeybinds;
        state.actions = actions;
        return state;
      }
    );
    builder.addCase(getAction.fulfilled, (state, action: PayloadAction<Action>) => {
      console.log(action.payload);
      state.actions = [...state.actions, action.payload];
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { setActionsPath, toggleKeybindViewer, removeAction } = actionsSlice.actions;

export const actionsReducer = actionsSlice.reducer;
