import { useOpenSpaceApi, useSubscribeToTime } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { Phase } from './types';

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

export function useSelectedMission(): {
  mission: Phase | undefined;
  hasMission: boolean;
} {
  const { isInitialized, data, selectedMissionIdentifier } = useAppSelector(
    (state) => state.missions
  );

  let mission: Phase | undefined = undefined;

  // If a new mission is added, the missions order might have changed so we try to find
  // the last one viewed
  if (isInitialized && selectedMissionIdentifier) {
    const selectedMission = data.missions.find(
      (mission) => mission.identifier === selectedMissionIdentifier
    );
    if (selectedMission) {
      mission = selectedMission;
    } else {
      mission = data.missions.at(0);
    }
  }

  const hasMission = isInitialized && mission !== undefined;

  return { hasMission, mission };
}
