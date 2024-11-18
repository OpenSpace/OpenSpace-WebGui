import { useEffect } from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';

import { useGetPropertyOwner, useGetStringPropertyValue } from '@/api/hooks';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { IconSize } from '@/types/enums';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
  // TODO when engineMode implemented
  //   const engineMode = useAppSelector(
  //     (state) => state.engineMode.mode || EngineModeUserControl
  //   );
  const anchor = useGetStringPropertyValue(NavigationAnchorKey);
  const aim = useGetStringPropertyValue(NavigationAimKey);
  const anchorName = useGetPropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;
  const aimName = useGetPropertyOwner(`${ScenePrefixKey}${aim}`)?.name ?? aim;

  const cappedAnchorName = anchorName?.substring(0, 20) ?? '';
  const cappedAimName = aimName?.substring(0, 20) ?? '';

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToProperty({ uri: NavigationAnchorKey }));
    dispatch(subscribeToProperty({ uri: NavigationAimKey }));
    return () => {
      dispatch(unsubscribeToProperty({ uri: NavigationAnchorKey }));
      dispatch(unsubscribeToProperty({ uri: NavigationAimKey }));
    };
  }, [dispatch]);

  function hasDistinctAim() {
    return aim !== '' && aim !== anchor;
  }

  function AnchorAndAimButton() {
    // TODO: make sure Button has a working label for screen readers since we have mixed
    // icons, text and other elements inside the button
    return (
      <Button onClick={onClick} size={'xl'}>
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

  function FocusButton() {
    return (
      <Button
        onClick={onClick}
        leftSection={<FocusIcon size={IconSize.lg} />}
        size={'xl'}
      >
        <Stack gap={0} align={'flex-start'} justify={'center'}>
          {cappedAnchorName}
          <Text>Focus</Text>
        </Stack>
      </Button>
    );
  }

  function renderMenuButtons() {
    // if(engineMode === EngineMode.CameraPath) {
    //     return cameraPathButtons();
    // }

    return hasDistinctAim() ? AnchorAndAimButton() : FocusButton();
  }

  return renderMenuButtons();
}
