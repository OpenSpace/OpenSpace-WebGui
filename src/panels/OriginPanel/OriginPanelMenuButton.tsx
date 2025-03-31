import { Group, Skeleton } from '@mantine/core';

import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { FocusIcon } from '@/icons/icons';
import { EngineMode, IconSize } from '@/types/enums';
import { useAimNode, useAnchorNode } from '@/util/propertyTreeHooks';

import { TaskBarMenuButton } from '../Menu/TaskBar/TaskBarMenuButton';

import { AnchorAimButtonContent } from './MenuButtons/AnchorAimButtonContent';
import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { FocusButtonContent } from './MenuButtons/FocusButtonContent';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface Props {
  id: string;
}

export function OriginPanelMenuButton({ id }: Props) {
  const aimNode = useAimNode();
  const anchorNode = useAnchorNode();

  const engineMode = useSubscribeToEngineMode();

  const hasDistinctAim = aimNode && aimNode.identifier !== anchorNode?.identifier;

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

  return hasDistinctAim ? (
    <TaskBarMenuButton id={id} disabled={!isReady}>
      <AnchorAimButtonContent />
    </TaskBarMenuButton>
  ) : (
    <TaskBarMenuButton
      id={id}
      disabled={!isReady}
      leftSection={<FocusIcon size={IconSize.lg} />}
    >
      {!isReady ? <Skeleton>Anchor</Skeleton> : <FocusButtonContent />}
    </TaskBarMenuButton>
  );
}
