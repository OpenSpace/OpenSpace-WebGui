import { useTranslation } from 'react-i18next';
import { Anchor, Group, Image, Text, Title } from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { OpenWindowIcon } from '@/icons/icons';
import { ActionsButton } from '@/panels/ActionsPanel/ActionsButton';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { MissionCaptureButtons } from './MissionCaptureButtons';
import { MissionTimeButtons } from './MissionTimeButtons';
import { DisplayedPhase, DisplayType, Phase } from './types';

interface Props {
  displayedPhase: DisplayedPhase;
  missionOverview: Phase;
}

export function MissionPhase({ displayedPhase, missionOverview }: Props) {
  const { width: panelWidth } = useWindowSize();
  const { t } = useTranslation('panel-missions');

  const isMissionOverview = displayedPhase.type === DisplayType.Overview;
  const timeLineWidth = 120;
  const actionButtonHeight = 80;
  if (!displayedPhase.data) {
    return <></>;
  }

  function title() {
    if (displayedPhase.type === DisplayType.Overview || !displayedPhase.type) {
      return '';
    }
    // Only show title if it is a Phase or a Milestone
    // If it is overview we don't want to show it twice
    return `${displayedPhase.type}: ${displayedPhase.data.name}`;
  }

  function timeString() {
    switch (displayedPhase.type) {
      case DisplayType.Overview:
      case DisplayType.Phase: {
        const start = new Date(displayedPhase.data.timerange.start).toDateString();
        const end = new Date(displayedPhase.data.timerange.end).toDateString();
        return `${start} - ${end}`;
      }
      case DisplayType.Milestone:
        return new Date(displayedPhase.data.date).toDateString();
      default:
        return '';
    }
  }

  return (
    <>
      <Title order={3}>{title()}</Title>
      <Text c={'dimmed'}>{timeString()}</Text>
      <Text my={'xs'}>{displayedPhase.data.description}</Text>
      {displayedPhase.data.link && (
        <Anchor component={'a'} href={displayedPhase.data.link} target={'_blank'}>
          <Group>
            <OpenWindowIcon />
            {t('mission-phase.read-more')}
          </Group>
        </Anchor>
      )}
      {displayedPhase.data.image && (
        <Image
          my={'xs'}
          mah={'300px'}
          src={displayedPhase.data.image}
          alt={'Image text not available'}
          fallbackSrc={'placeholder.svg'}
          fit={'contain'}
        />
      )}
      <Title order={3} my={'md'}>
        {t('set-time')}
      </Title>

      <MissionTimeButtons currentPhase={displayedPhase} />
      <MissionCaptureButtons mission={missionOverview} />
      <Title order={3} my={'md'}>
        {t('mission-phase.actions.title')}
      </Title>
      {displayedPhase.data?.actions?.length === 0 &&
        displayedPhase.data.actions.length === 0 && (
          <Text c={'dimmed'}>{t('mission-phase.actions.no-actions')}</Text>
        )}
      <DynamicGrid minChildSize={170} gridWidth={panelWidth - timeLineWidth}>
        {/* Show phase specific actions */}
        {!isMissionOverview &&
          displayedPhase.data?.actions?.map((uri) => (
            <ActionsButton uri={uri} key={uri} height={actionButtonHeight} />
          ))}
        {/* We always want to show the actions for the whole mission */}
        {missionOverview.actions?.map((uri) => (
          <ActionsButton uri={uri} key={uri} height={actionButtonHeight} />
        ))}
      </DynamicGrid>
    </>
  );
}
