import { useEffect } from 'react';
import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';

import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/propertyTreeMiddleware';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

interface OriginPanelMenuButtonProps {
  onClick: () => void;
}

export function OriginPanelMenuButton({ onClick }: OriginPanelMenuButtonProps) {
  // TODO when engineMode implemented
  //   const engineMode = useAppSelector(
  //     (state) => state.engineMode.mode || EngineModeUserControl
  //   );
  const anchor = useAppSelector(
    (state) => state.propertyTree.props.properties[NavigationAnchorKey]?.value
  );
  const aim = useAppSelector(
    (state) => state.propertyTree.props.properties[NavigationAimKey]?.value
  );
  const anchorName = useAppSelector(
    (state) =>
      state.propertyTree.owners.propertyOwners[ScenePrefixKey + anchor]?.name ??
      (anchor as string | undefined)
  );
  const aimName = useAppSelector(
    (state) =>
      state.propertyTree.owners.propertyOwners[ScenePrefixKey + aim]?.name ??
      (aim as string | undefined)
  );
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
            <AnchorIcon size={'calc(2.125rem * var(--mantine-scale))'} />
            <Stack gap={0} align={'flex-start'}>
              {cappedAnchorName}
              <Text>Anchor</Text>
            </Stack>
          </>
          <>
            <TelescopeIcon size={'calc(2.125rem * var(--mantine-scale))'} />
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
        // TODO: create xs-xl sizes for icons that are not within an ActionIcons for example
        onClick={onClick}
        leftSection={<FocusIcon size={'calc(2.125rem * var(--mantine-scale))'} />}
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
