import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OpenSpaceTimeState } from '@/types/types';

export interface TimeState {
  time?: number; // Number of milliseconds for this date since the epoch 01/01/1970 UTC
  timeCapped?: number; // Number of milliseconds for this date since the epoch 01/01/1970
  targetDeltaTime?: number;
  deltaTime?: number;
  isPaused?: boolean;
  hasNextStep?: boolean;
  hasPrevStep?: boolean;
  nextStep?: number;
  prevStep?: number;
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
  hasNextStep: undefined,
  hasPrevStep: undefined,
  nextStep: undefined,
  prevStep: undefined,
  deltaTimeSteps: undefined
};

function monthToNumber(month: string) {
  // Dictionary to map month abbreviations to their corresponding two-digit numbers
  const monthMapping: { [key: string]: string } = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12'
  };
  // TODO: we should not recieve anything else but if that were to happen, what should
  // default behaviour be?
  return monthMapping[month] || '';
}

// Using this hack to parse times
// https://scholarslab.lib.virginia.edu/blog/parsing-bc-dates-with-javascript/
function dateStringWithTimeZone(date: string, zone = 'Z') {
  // Ensure we don't have white spaces
  const whitespaceRemoved = date.replace(/\s/g, '');
  let result: string;
  // If we are in negative years (before year 0)
  if (whitespaceRemoved[0] === '-') {
    // Remove first dash so we can split it where the year ends
    const unsignedDate = whitespaceRemoved.substring(1);
    // Get the year by searching for first '-'
    const unsignedYear = unsignedDate.substring(0, unsignedDate.indexOf('-'));
    // Create year for the pattern '-00YYYY' for negative years (see link above)
    const filledYear = `-${unsignedYear.padStart(6, '0')}`;
    // Get everything after the year
    const rest = unsignedDate.substring(unsignedDate.indexOf('-'));
    result = filledYear.concat(rest);
  } else if (whitespaceRemoved[0] === 'B') {
    // Year < 1000 B.C have a different format, B.C. YYYY MM DD HH:MM:SSS
    // Due to the fixed length of the string we get from OpenSpace, we might also be
    // missing information regarding hh:mm:ss for example:
    // "B.C. 202969 JAN 09 16:5" and  "B.C. 3693 JUL 19 17:29:"

    // If we are unable to get month and day from the string chances are that the date is
    // very far back in the past and that the month, day, and time is kind of meaningless
    // We build a fake date that atleast uses the correct year to display *something*
    const [, unsignedYear, month, day] = date.split(' ');
    if (!unsignedYear) {
      // We failed to parse the year, return an invalid date
      return '';
    }
    const monthNumber = monthToNumber(month);
    // Create year for the pattern '-00YYYY' for negative years (see link above)
    const filledYear = `-${unsignedYear.padStart(6, '0')}`;
    // Build the string to correct format ignoring the time since that information might
    // be broken anyways.
    result = `${filledYear}-${monthNumber ?? '01'}-${day ?? '01'}T00:00:00.000`;
  } else {
    // After year 0, we will either get it in ISO format or
    const yearIndex = whitespaceRemoved.indexOf('-');
    if (yearIndex >= 0) {
      // Year is in the range (0,9999)
      const year = whitespaceRemoved.substring(0, yearIndex);
      const rest = whitespaceRemoved.substring(yearIndex);
      const filledYear = year.padStart(4, '0');
      result = filledYear.concat(rest);
    } else {
      // Year is above 10.000 and we have yet another format from OpenSpace as follows:
      // YYYY MMM DD HH:MM:SS.xxx
      const [year, month, day, time] = date.split(' ');
      const [hours, minutes, seconds] = time.split(/[:.]/);
      const monthNumber = monthToNumber(month);
      // For `Date` to correctly parse we need to append '+' and leading zeros
      const filledYear = year.padStart(6, '0');
      result = `+${filledYear}-${monthNumber ?? '01'}-${day ?? '01'}T${hours ?? '00'}:${minutes ?? '00'}:${seconds ?? '00'}.000`;
    }
  }
  return !result.includes(zone) ? result.concat(zone) : result;
}

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
        if (!isNaN(ztime.valueOf())) {
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
      if (deltaTime) {
        state.deltaTime = deltaTime;
      }
      if (targetDeltaTime) {
        state.targetDeltaTime = targetDeltaTime;
      }
      if (isPaused) {
        state.isPaused = isPaused;
      }
      if (hasNextStep) {
        state.hasNextStep = hasNextStep;
      }
      if (hasPrevStep) {
        state.hasPrevStep = hasPrevStep;
      }
      if (nextStep) {
        state.nextStep = nextStep;
      }
      if (prevStep) {
        state.prevStep = prevStep;
      }
      if (deltaTimeSteps) {
        state.deltaTimeSteps = deltaTimeSteps;
      }

      return state;
    }
  }
});

export const { updateTime } = time.actions;
export const timeReducer = time.reducer;
