import { Group, Skeleton } from '@mantine/core';

import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { EngineMode } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { TaskBarMenuButton } from '../Menu/TaskBar/TaskBarMenuButton';

import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';
import { OriginPanelMenuButtonContent } from './MenuButtons/OriginPanelMenuButtonContent';

interface Props {
  id: string;
}

export function OriginPanelMenuButton({ id }: Props) {
  const engineMode = useSubscribeToEngineMode();
  const anchorNode = useAnchorNode();

  const isReady = anchorNode !== undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  if (isInFlight) {
    return (
      <Group>
        <RemainingFlightTimeIndicator />
        <CancelFlightButton />
      </Group>
    );
  }

  if (!isReady) {
    return <Skeleton>Anchor</Skeleton>;
  }

  return (
    <TaskBarMenuButton id={id} disabled={!isReady}>
      <OriginPanelMenuButtonContent />
    </TaskBarMenuButton>
  );
}
