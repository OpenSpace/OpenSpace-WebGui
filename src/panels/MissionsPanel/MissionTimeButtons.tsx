import { useTranslation } from 'react-i18next';
import { Button, Group } from '@mantine/core';

import { GoToEnd, GoToStart, TimerIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { useJumpToTime } from './hooks';
import { DisplayedPhase, DisplayType } from './types';

interface Props {
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({ currentPhase }: Props) {
  const jumpToTime = useJumpToTime();
  const { t } = useTranslation('panel-missions');
  const isMissionOverview = currentPhase.type === DisplayType.Overview;

  function jumpToEndOfPhase() {
    if (currentPhase.type === DisplayType.Phase || isMissionOverview) {
      jumpToTime(currentPhase.data.timerange.end);
    }
  }

  function jumpToStartOfPhase() {
    if (currentPhase.type === DisplayType.Phase || isMissionOverview) {
      jumpToTime(currentPhase.data.timerange.start);
    }
  }

  switch (currentPhase.type) {
    case DisplayType.Overview:
    case DisplayType.Phase: {
      const phaseType = isMissionOverview
        ? t('mission-time-buttons.mission')
        : t('phase');
      return (
        <Group wrap={'nowrap'} gap={'xs'}>
          <Button
            onClick={jumpToStartOfPhase}
            leftSection={<GoToStart size={IconSize.xs} />}
          >
            {t('mission-time-buttons.start-phase', { phase: phaseType })}
          </Button>
          <Button
            onClick={jumpToEndOfPhase}
            rightSection={<GoToEnd size={IconSize.xs} />}
          >
            {t('mission-time-buttons.end-phase', { phase: phaseType })}
          </Button>
        </Group>
      );
    }
    case DisplayType.Milestone:
      return (
        <Button onClick={() => jumpToTime(currentPhase.data.date)} fullWidth>
          <Group>
            <TimerIcon />
            {t('set-time')}
          </Group>
        </Button>
      );
    default:
      return <></>;
  }
}
