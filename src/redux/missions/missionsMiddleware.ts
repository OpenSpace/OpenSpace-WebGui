import { api } from '@/api/api';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { Phase } from '@/types/mission-types';

import { onOpenConnection } from '../connection/connectionSlice';

import { initializeMissions } from './missionsSlice';

interface MissionData {
  done: boolean;
  value: {
    missions: Phase[] | null;
  };
}

async function getMissions(callback: (missions: { missions: Phase[] }) => void) {
  const missionTopic = api.startTopic('missions', {});
  const { value } = (await missionTopic.iterator().next()) as MissionData;
  if (value.missions !== null) {
    callback({ missions: value.missions });
  }
  missionTopic.cancel();
}

export const addMissionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, api) => {
      getMissions((missions) => {
        api.dispatch(initializeMissions(missions));
      });
    }
  });
};
