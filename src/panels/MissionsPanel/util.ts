import { isDateValid } from '@/redux/time/util';

export function makeUTCString(time: string): string {
  return time.includes('Z') ? time : `${time}Z`;
}

export function jumpToTime(
  currentTime: number | undefined,
  time: string,
  luaApi: OpenSpace.openspace | null,
  fadeTime: number = 1
): void {
  if (currentTime === undefined) {
    return;
  }

  const utcTime = new Date(makeUTCString(time));

  if (!isDateValid(utcTime)) {
    return;
  }

  const timeDiffInSeconds = Math.abs(currentTime - utcTime.valueOf()) / 1000;
  const nSecondsInADay = 86400;
  const diffBiggerThanADay = timeDiffInSeconds > nSecondsInADay;

  if (diffBiggerThanADay) {
    luaApi?.setPropertyValueSingle(
      'RenderEngine.BlackoutFactor',
      0,
      fadeTime,
      'QuadraticEaseOut'
    );
    setTimeout(() => {
      luaApi?.time.setTime(utcTime.toISOString());
      luaApi?.setPropertyValueSingle(
        'RenderEngine.BlackoutFactor',
        1,
        fadeTime,
        'QuadraticEaseIn'
      );
    }, fadeTime * 1000);
  } else {
    luaApi?.time.interpolateTime(utcTime.toISOString(), fadeTime);
  }
}
