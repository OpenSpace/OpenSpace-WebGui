import { ActionsButton } from '@/panels/ActionsPanel/ActionsButton';
import { MissionCaptureButtons } from './MissionCaptureButtons';
import { MissionTimeButtons } from './MissionTimeButtons';
import { Button, Flex, Image, Text, Title } from '@mantine/core';
import { DisplayedPhase } from './MissionContent';
import { DisplayType } from '@/types/enums';
import { Phase } from '@/types/mission-types';

interface MissionPhaseProps {
  displayedPhase: DisplayedPhase;
  isMissionOverview: boolean;
  missionOverview: Phase;
}

export function MissionPhase({
  displayedPhase,
  isMissionOverview,
  missionOverview
}: MissionPhaseProps) {
  function title() {
    // Hide title if the overview is currently shown (we don't want to show it twice)
    const hasType = displayedPhase.type;
    const hideTile = isMissionOverview || !hasType;
    return hideTile ? '' : `${displayedPhase.type}: ${displayedPhase.data.name}`;
  }

  function timeString() {
    switch (displayedPhase.type) {
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

  return displayedPhase.data ? (
    <>
      <Title order={4}>{title()}</Title>
      <Text c={'dimmed'}>{timeString()}</Text>
      <Text my={'xs'}>{displayedPhase.data.description}</Text>
      {displayedPhase.data.link && (
        <Button component={'a'} href={displayedPhase.data.link} target={'_blank'}>
          Read more
        </Button>
      )}
      {displayedPhase.data.image && (
        <Image
          my={'xs'}
          maw={window.innerWidth * 0.25}
          src={displayedPhase.data.image}
          alt={'Image text not available'}
        />
      )}
      <MissionTimeButtons
        currentPhase={displayedPhase}
        isMissionOverview={isMissionOverview}
      />
      <MissionCaptureButtons mission={missionOverview} />{' '}
      <Flex wrap={'wrap'} gap={'xs'} my={'xs'}>
        {/* Show phase specific actions */}
        {!isMissionOverview &&
          displayedPhase.data?.actions?.map((uri) => (
            <ActionsButton key={uri} uri={uri} />
          ))}
        {/* We always want to show the actions for the whole mission */}
        {missionOverview?.actions?.map((uri) => <ActionsButton key={uri} uri={uri} />)}
      </Flex>
    </>
  ) : (
    <Text> No data for this time range </Text>
  );
}
