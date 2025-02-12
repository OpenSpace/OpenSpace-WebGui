import { useEffect } from 'react';
import { Button, Card, Group, Paper, Skeleton, Stack, Text } from '@mantine/core';

import { useGetPropertyOwner, useGetStringPropertyValue } from '@/api/hooks';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import {
  subscribeToEngineMode,
  unsubscribeToEngineMode
} from '@/redux/enginemode/engineModeMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

import { CancelFlightButton } from './CancelFlightButton';
import { RemainingFlightTimeIndicator } from './RemainingFlightTimeIndicator';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
  const engineMode = useAppSelector((state) => state.engineMode.mode);
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim] = useGetStringPropertyValue(NavigationAimKey);
  const anchorName = useGetPropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;
  const aimName = useGetPropertyOwner(`${ScenePrefixKey}${aim}`)?.name ?? aim;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToEngineMode());
    return () => {
      dispatch(unsubscribeToEngineMode());
    };
  }, [dispatch]);

  function hasDistinctAim() {
    return aim !== '' && aim !== anchor;
  }

  const isReady = anchor !== '' && anchor !== undefined;

  function AnchorAndAimButton(): React.JSX.Element {
    // TODO: make sure Button has a working label for screen readers since we have mixed
    // icons, text and other elements inside the button
    return (
      <Button onClick={onClick} size={'xl'} disabled={!isReady}>
        <Group>
          <>
            <AnchorIcon size={IconSize.lg} />
            <Stack gap={0} maw={130} style={{ textAlign: 'start' }}>
              <Text truncate>{anchorName}</Text>
              <Text>Anchor</Text>
            </Stack>
          </>
          <>
            <TelescopeIcon size={IconSize.lg} />
            <Stack gap={0} maw={130} style={{ textAlign: 'start' }}>
              <Text truncate>{aimName}</Text>
              <Text>Aim</Text>
            </Stack>
          </>
        </Group>
      </Button>
    );
  }

  function FocusButton(): React.JSX.Element {
    return (
      <Button
        onClick={onClick}
        disabled={!isReady}
        leftSection={<FocusIcon size={IconSize.lg} />}
        size={'xl'}
      >
        <Stack gap={0} justify={'center'} maw={130} style={{ textAlign: 'start' }}>
          {!isReady && <Skeleton>Anchor</Skeleton>}
          <Text truncate>{anchorName}</Text>
          <Text>Focus</Text>
        </Stack>
      </Button>
    );
  }

  function cameraPathButtons(): React.JSX.Element {
    return (
      <Group>
        <CancelFlightButton />
        <RemainingFlightTimeIndicator />
      </Group>
    );
  }

  function renderMenuButtons(): React.JSX.Element {
    if (engineMode === EngineMode.CameraPath) {
      return cameraPathButtons();
    }

    return hasDistinctAim() ? AnchorAndAimButton() : FocusButton();
  }

  return renderMenuButtons();
}
