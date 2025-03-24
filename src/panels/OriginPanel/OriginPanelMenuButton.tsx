import { Group } from '@mantine/core';

import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { EngineMode } from '@/types/enums';
import { useAimNode, useAnchorNode } from '@/util/propertyTreeHooks';

import { AnchorAimButtons } from './MenuButtons/AnchorAimButtons';
import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { FocusButton } from './MenuButtons/FocusButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
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
    <AnchorAimButtons
      anchorName={anchorNode?.name}
      aimName={aimNode?.name}
      isOpenSpaceReady={isReady}
      onClick={onClick}
    />
  ) : (
    <FocusButton
      anchorName={anchorNode?.name}
      isOpenSpaceReady={isReady}
      onClick={onClick}
    />
  );
}
