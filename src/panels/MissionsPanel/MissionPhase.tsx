import { Anchor, Group, Image, Text, Title } from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { OpenWindowIcon } from '@/icons/icons';
import { ActionsButton } from '@/panels/ActionsPanel/ActionsButton';
import { DisplayType } from '@/types/enums';
import { DisplayedPhase, Phase } from '@/types/mission-types';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { MissionCaptureButtons } from './MissionCaptureButtons';
import { MissionTimeButtons } from './MissionTimeButtons';

interface Props {
  displayedPhase: DisplayedPhase;
  missionOverview: Phase;
}

export function MissionPhase({ displayedPhase, missionOverview }: Props) {
  const { width: panelWidth } = useWindowSize();
  const isMissionOverview = displayedPhase.type === DisplayType.Overview;
  const timeLineWidth = 120;

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
            Read more
          </Group>
        </Anchor>
      )}
      {displayedPhase.data.image && (
        <Image
          my={'xs'}
          maw={window.innerWidth * 0.25}
          src={displayedPhase.data.image}
          alt={'Image text not available'}
          fallbackSrc={'https://placehold.co/600x400?text=Placeholder'}
        />
      )}
      <Title order={3} my={'md'}>
        Set time
      </Title>

      <MissionTimeButtons currentPhase={displayedPhase} />
      <MissionCaptureButtons mission={missionOverview} />
      <Title order={3} my={'md'}>
        Actions
      </Title>
      <DynamicGrid minChildSize={170} gridWidth={panelWidth - timeLineWidth}>
        {/* Show phase specific actions */}
        {!isMissionOverview &&
          displayedPhase.data?.actions?.map((uri) => (
            <ActionsButton uri={uri} key={uri} />
          ))}
        {/* We always want to show the actions for the whole mission */}
        {missionOverview.actions?.map((uri) => <ActionsButton uri={uri} key={uri} />)}
      </DynamicGrid>
    </>
  );
}
