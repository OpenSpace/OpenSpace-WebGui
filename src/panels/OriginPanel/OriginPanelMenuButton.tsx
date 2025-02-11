import { useEffect } from 'react';
import { Button, Group, Skeleton, Stack, Text } from '@mantine/core';

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
import { RemainingFlightTime } from './RemainingFlightTime';

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
  const cappedAnchorName = anchorName?.substring(0, 20) ?? '';
  const cappedAimName = aimName?.substring(0, 20) ?? '';

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
            <Stack gap={0} align={'flex-start'}>
              {cappedAnchorName}
              <Text>Anchor</Text>
            </Stack>
          </>
          <>
            <TelescopeIcon size={IconSize.lg} />
            <Stack gap={0} align={'flex-start'}>
              {cappedAimName}
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
        <Stack gap={0} align={'flex-start'} justify={'center'}>
          {!isReady && <Skeleton>Anchor</Skeleton>}
          {cappedAnchorName}
          <Text>Focus</Text>
        </Stack>
      </Button>
    );
  }

  function cameraPathButtons() {
    return (
      <Group gap={'xs'}>
        <CancelFlightButton />
        <RemainingFlightTime />
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
