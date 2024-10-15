import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Action, ActionOrKeybind, Keybind } from 'src/types/types';

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
    initializeShortcuts: (state, action: PayloadAction<ActionOrKeybind[]>) => {
      const [actions, keybinds] = splitActionsAndKeybinds(action.payload);
      return {
        ...state,
        isInitialized: true,
        keybinds: keybinds,
        actions: actions
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
    addActions: (state, action: PayloadAction<ActionOrKeybind[]>) => {
      const [actions, keybinds] = splitActionsAndKeybinds(action.payload);
      return {
        ...state,
        actions: [...state.actions, ...actions],
        keybinds: [...state.keybinds, ...keybinds]
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
