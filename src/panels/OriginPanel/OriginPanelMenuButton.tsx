import { Group } from '@mantine/core';

import {
  useGetPropertyOwner,
  useGetStringPropertyValue,
  useSubscribeToEngineMode
} from '@/api/hooks';
import { EngineMode } from '@/types/enums';
import { MenuItemEventHandlers } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

import { AnchorAimButtons } from './MenuButtons/AnchorAimButtons';
import { CancelFlightButton } from './MenuButtons/CancelFlightButton';
import { FocusButton } from './MenuButtons/FocusButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface Props {
  eventHandlers: MenuItemEventHandlers;
}

export function OriginPanelMenuButton({ eventHandlers }: Props) {
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
      eventHandlers={eventHandlers}
    />
  ) : (
    <FocusButton
      anchorName={anchorName}
      isOpenSpaceReady={isReady}
      eventHandlers={eventHandlers}
    />
  );
}
