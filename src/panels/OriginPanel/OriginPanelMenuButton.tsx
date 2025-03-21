import { Group } from '@mantine/core';

import { useStringProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { EngineMode } from '@/types/enums';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

import { AnchorAimButtons } from './MenuButtons/AnchorAimButtons';
import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { FocusButton } from './MenuButtons/FocusButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
  const [anchor] = useStringProperty(NavigationAnchorKey);
  const [aim] = useStringProperty(NavigationAimKey);
  const anchorName = usePropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;
  const aimName = usePropertyOwner(`${ScenePrefixKey}${aim}`)?.name ?? aim;
  const engineMode = useSubscribeToEngineMode();

  function hasDistinctAim() {
    return aim !== '' && aim !== anchor;
  }

  const isReady = anchor !== '' && anchor !== undefined;

  const isInFlight = engineMode === EngineMode.CameraPath;

  if (isInFlight) {
    return (
      <Group>
        <RemainingFlightTimeIndicator />
        <CancelFlightButton />
      </Group>
    );
  }

  return hasDistinctAim() ? (
    <AnchorAimButtons
      anchorName={anchorName}
      aimName={aimName}
      isOpenSpaceReady={isReady}
      onClick={onClick}
    />
  ) : (
    <FocusButton anchorName={anchorName} isOpenSpaceReady={isReady} onClick={onClick} />
  );
}
