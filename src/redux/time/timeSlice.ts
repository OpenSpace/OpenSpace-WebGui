import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OpenSpaceTimeState } from '@/types/types';

import { dateStringWithTimeZone, isDateValid } from './util';

export interface TimeState {
  time?: number; // Number of milliseconds for this date since the epoch 01/01/1970 UTC
  timeCapped?: number; // Number of milliseconds for this date since the epoch 01/01/1970
  targetDeltaTime?: number;
  deltaTime?: number;
  isPaused?: boolean;
  hasNextDeltaTimeStep?: boolean;
  hasPrevDeltaTimeStep?: boolean;
  nextDeltaTimeStep?: number;
  prevDeltaTimeStep?: number;
  deltaTimeSteps?: number[];
}

// TODO: we could leave this as empty but i think its better to be explicit that they
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
      const { time: newTime } = action.payload;
      const { deltaTime } = action.payload;
      const { targetDeltaTime } = action.payload;
      const { isPaused } = action.payload;
      const { hasNextStep } = action.payload;
      const { hasPrevStep } = action.payload;
      const { nextStep } = action.payload;
      const { prevStep } = action.payload;
      const { deltaTimeSteps } = action.payload;

      if (newTime) {
        // We store the number of milliseconds for this date since the Date obj itself is
        // not serializable in redux
        const ztime = new Date(dateStringWithTimeZone(newTime));
        if (isDateValid(ztime)) {
          state.time = ztime.valueOf();
          // Make optimized time that only updates every second
          const newCappedMilliSeconds = ztime.setMilliseconds(0);
          if (!state.timeCapped) {
            // First time state is updated (or after being unset)
            state.timeCapped = newCappedMilliSeconds;
          } else if (state.timeCapped !== newCappedMilliSeconds) {
            // Only update state every second
            state.timeCapped = newCappedMilliSeconds;
          }
        } else {
          //TODO: if the ztime is undefined what do we want to do with time? If we let it
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
