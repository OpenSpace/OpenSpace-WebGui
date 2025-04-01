import { Group } from '@mantine/core';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { EngineMode } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { TaskBarMenuButton } from '../Menu/TaskBar/TaskBarMenuButton';

import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { OriginPanelMenuButtonContent } from './MenuButtons/OriginPanelMenuButtonContent';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

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
    return (
      <TaskBarMenuButton id={id} disabled>
        <LoadingBlocks n={1} w={84} />
      </TaskBarMenuButton>
    );
  }
  return (
    <TaskBarMenuButton id={id}>
      <OriginPanelMenuButtonContent />
    </TaskBarMenuButton>
  );
}
