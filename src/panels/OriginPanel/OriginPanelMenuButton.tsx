import { Group } from '@mantine/core';

import {
  useGetPropertyOwner,
  useGetStringPropertyValue,
  useSubscribeToEngineMode
} from '@/api/hooks';
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
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim] = useGetStringPropertyValue(NavigationAimKey);
  const anchorName = useGetPropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;
  const aimName = useGetPropertyOwner(`${ScenePrefixKey}${aim}`)?.name ?? aim;
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
