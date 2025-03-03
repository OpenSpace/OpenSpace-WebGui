import { createAction } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { Phase } from '@/panels/MissionsPanel/types';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';

import { clearMissions, initializeMissions } from './missionsSlice';

export const refreshMissions = createAction<void>('missions/refreshMissions');

interface MissionData {
  done: boolean;
  value: {
    missions: Phase[] | null;
  };
}

async function getMissions(callback: (missions: { missions: Phase[] } | null) => void) {
  const missionTopic = api.startTopic('missions', {});
  const { value } = (await missionTopic.iterator().next()) as MissionData;
  if (value.missions) {
    callback({ missions: value.missions });
  } else {
    callback(null);
  }

  missionTopic.cancel();
}

export const addMissionsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, api) => {
      getMissions((missions) => {
        if (missions) {
          api.dispatch(initializeMissions(missions));
        }
      });
    }
  });

  startListening({
    actionCreator: refreshMissions,
    effect: (_, api) => {
      getMissions((missions) => {
        if (missions) {
          api.dispatch(initializeMissions(missions));
        } else {
          api.dispatch(clearMissions());
        }
      });
    }
  });
};
