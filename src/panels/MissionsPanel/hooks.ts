import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { isDateValid } from '@/redux/time/util';

type ReturnType = (time: string) => void;

export function useJumpToTime(fadeTime: number = 1): ReturnType {
  const currentTime = useSubscribeToTime();
  const luaApi = useOpenSpaceApi();

  return (time: string) => {
    const utcDate = new Date(time);

    if (!isDateValid(utcDate) || currentTime === undefined) {
      return;
    }

    const timeDiffInSeconds = Math.abs(currentTime - utcDate.valueOf()) / 1000.0;
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
  };
}
