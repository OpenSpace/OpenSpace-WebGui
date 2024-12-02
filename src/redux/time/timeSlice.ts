import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OpenSpaceTimeState } from '@/types/types';

import { dateStringUTC as parseTimeStringToUTCString, isDateValid } from './util';

export interface TimeState {
  time?: number; // No of milliseconds for this date since the epoch 01/01/1970 UTC
  timeCapped?: number; // Rounded no of milliseconds for this date since the epoch 01/01/1970 UTC
  targetDeltaTime?: number;
  deltaTime?: number;
  isPaused?: boolean;
  hasNextDeltaTimeStep?: boolean;
  hasPrevDeltaTimeStep?: boolean;
  nextDeltaTimeStep?: number;
  prevDeltaTimeStep?: number;
  deltaTimeSteps?: number[];
}

// We could leave this as empty but better to be explicit that they
// are undefined at start
const initialState: TimeState = {
  time: undefined,
  timeCapped: undefined,
  targetDeltaTime: undefined,
  deltaTime: undefined,
  isPaused: undefined,
  hasNextDeltaTimeStep: undefined,
  hasPrevDeltaTimeStep: undefined,
  nextDeltaTimeStep: undefined,
  prevDeltaTimeStep: undefined,
  deltaTimeSteps: undefined
};

export const time = createSlice({
  name: 'time',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<OpenSpaceTimeState>) => {
      const {
        time: newTime,
        deltaTime,
        targetDeltaTime,
        isPaused,
        hasNextStep,
        hasPrevStep,
        nextStep,
        prevStep,
        deltaTimeSteps
      } = action.payload;

      if (newTime) {
        // We store the number of milliseconds for this date since the Date obj itself is
        // not serializable in redux
        const ztime = new Date(parseTimeStringToUTCString(newTime));
        if (isDateValid(ztime)) {
          state.time = ztime.valueOf();
          // Make optimized time that only updates every second
          const newCappedMilliSeconds = ztime.setMilliseconds(0);
          // First time state is updated (or after being unset)
          // Or only update state every second
          const isUpdated = state.timeCapped !== newCappedMilliSeconds;
          if (!state.timeCapped || isUpdated) {
            state.timeCapped = newCappedMilliSeconds;
          }
        } else {
          // If the ztime is undefined we need to decide what to do. If we let it
          // be then time will be "stuck" on whatever was the latest working date
          // but if we give it undefined we can handle it easier in code and display other text eg.
          state.time = undefined;
          state.timeCapped = undefined;
        }
      }
      if (deltaTime !== undefined) {
        state.deltaTime = deltaTime;
      }
      if (targetDeltaTime !== undefined) {
        state.targetDeltaTime = targetDeltaTime;
      }
      if (isPaused !== undefined) {
        state.isPaused = isPaused;
      }
      if (hasNextStep !== undefined) {
        state.hasNextDeltaTimeStep = hasNextStep;
      }
      if (hasPrevStep !== undefined) {
        state.hasPrevDeltaTimeStep = hasPrevStep;
      }
      if (nextStep !== undefined) {
        state.nextDeltaTimeStep = nextStep;
      }
      if (prevStep !== undefined) {
        state.prevDeltaTimeStep = prevStep;
      }
      if (deltaTimeSteps !== undefined) {
        state.deltaTimeSteps = deltaTimeSteps;
      }

      return state;
    }
  }
});

export const { updateTime } = time.actions;
export const timeReducer = time.reducer;

// Action types can be inferred from the slice:
export type Actions = ReturnType<typeof time.actions.updateTime>;
