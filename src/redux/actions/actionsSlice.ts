import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Action, ActionOrKeybind, Keybind } from '@/types/types';

import { getAllShortcuts, getShortcut } from './actionsMiddleware';

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

// TODO: (ylvse 2024-10-14) - This splitting of the actions and keybinds could be removed
// if we didn't merge the arrays in the engine to begin with.
// Once we ship this new GUI, we should rewrite the topic so that it sends the keybinds
// and the actions as two separate arrays
function instanceOfAction(data: ActionOrKeybind): data is Action {
  return 'identifier' in data;
}

function splitActionsAndKeybinds(data: ActionOrKeybind[]): [Action[], Keybind[]] {
  const actions: Action[] = [];
  const keybinds: Keybind[] = [];
  data.forEach((element) => {
    if (instanceOfAction(element)) {
      actions.push(element);
    } else {
      keybinds.push(element);
    }
  });
  return [actions, keybinds];
}

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
      const newData = state.actions;
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
  },
  extraReducers: (builder) => {
    builder.addCase(getAllShortcuts.fulfilled, (state, action) => {
      const [actions, keybinds] = splitActionsAndKeybinds(action.payload);
      state.isInitialized = true;
      state.keybinds = keybinds;
      state.actions = actions;
      return state;
    });
    builder.addCase(getShortcut.fulfilled, (state, action) => {
      const [actions, keybinds] = splitActionsAndKeybinds(action.payload);
      state.actions = [...state.actions, ...actions];
      state.keybinds = [...state.keybinds, ...keybinds];
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { setActionsPath, toggleKeybindViewer, removeAction } = actionsSlice.actions;

export const actionsReducer = actionsSlice.reducer;
