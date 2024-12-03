import { isDateValid } from '@/redux/time/util';

export function jumpToTime(
  currentTime: number | undefined,
  time: string,
  luaApi: OpenSpace.openspace | null,
  fadeTime: number = 1
): void {
  if (currentTime === undefined) {
    return;
  }

  const utcDate = new Date(time);

  if (!isDateValid(utcDate)) {
    return;
  }

  const timeDiffInSeconds = Math.abs(currentTime - utcDate.valueOf()) / 1000;
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
      luaApi?.time.setTime(utcDate.toISOString());
      luaApi?.setPropertyValueSingle(
        'RenderEngine.BlackoutFactor',
        1,
        fadeTime,
        'QuadraticEaseIn'
      );
    }, fadeTime * 1000);
  } else {
    luaApi?.time.interpolateTime(utcDate.toISOString(), fadeTime);
  }
}
