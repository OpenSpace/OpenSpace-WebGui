import { Group } from '@mantine/core';

import { useSubscribeToEngineMode } from '@/api/hooks';
import { EngineMode } from '@/types/enums';
import { useGetAimNode, useGetAnchorNode } from '@/util/propertyTreeHooks';

import { AnchorAimButtons } from './MenuButtons/AnchorAimButtons';
import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { FocusButton } from './MenuButtons/FocusButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
  const aimNode = useGetAimNode();
  const anchorNode = useGetAnchorNode();

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
