import React from 'react';
import {
  ActionIcon,
  ActionIconProps,
  Button,
  ButtonProps,
  Kbd,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  AirplaneIcon,
  FocusIcon,
  FrameFocusIcon,
  LightningFlashIcon
} from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Identifier } from '@/types/types';
import { NavigationAimKey, NavigationAnchorKey, RetargetAnchorKey } from '@/util/keys';

interface BaseProps {
  type: NavigationType;
  identifier: Identifier;
  showLabel?: boolean;
  onFinish?: () => void;
}

interface ButtonBaseProps extends ButtonProps {
  showLabel: true;
}
interface ActionIconBaseProps extends ActionIconProps {
  showLabel?: false;
  justify?: never;
}

type BaseButtonProps = ButtonBaseProps | ActionIconBaseProps;

interface PathNavigationProps extends BaseProps {
  type: Exclude<NavigationType, NavigationType.JumpGeo | NavigationType.FlyGeo>;
  latitude?: never;
  longitude?: never;
  altitude?: never;
}

interface GeoNavigationProps extends BaseProps {
  type: NavigationType.FlyGeo | NavigationType.JumpGeo;
  latitude: number;
  longitude: number;
  altitude: number;
}

type NodeNavigationButtonProps =
  | (PathNavigationProps & BaseButtonProps)
  | (GeoNavigationProps & BaseButtonProps);

interface ButtonContent {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon: React.JSX.Element;
  title: string;
  tooltip: React.JSX.Element | string;
}

export function NodeNavigationButton({
  type,
  identifier,
  showLabel,
  onFinish,
  variant,
  latitude,
  longitude,
  altitude,
  justify,
  size,
  style,
  disabled
}: NodeNavigationButtonProps) {
  const luaApi = useOpenSpaceApi();

  function focus(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!event.shiftKey) {
      luaApi?.setPropertyValueSingle(RetargetAnchorKey, null);
    }
    luaApi?.setPropertyValueSingle(NavigationAnchorKey, identifier);
    luaApi?.setPropertyValueSingle(NavigationAimKey, '');
    // event.stopPropagation(); TODO: why do we need to explicitly stop propagating here?
    onFinish?.();
  }

  function flyTo(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event.shiftKey) {
      luaApi?.pathnavigation.flyTo(identifier, 0.0);
    } else {
      luaApi?.pathnavigation.flyTo(identifier);
    }
    // stop propagation?
    onFinish?.();
  }

  function flyToGeo(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (type !== NavigationType.FlyGeo && type !== NavigationType.JumpGeo) {
      return;
    }
    if (event.shiftKey) {
      luaApi?.globebrowsing.flyToGeo(identifier, latitude, longitude, altitude, 0.0);
    } else {
      luaApi?.globebrowsing.flyToGeo(identifier, latitude, longitude, altitude);
    }
  }

  function zoomToFocus(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event.shiftKey) {
      luaApi?.pathnavigation.createPath({
        TargetType: 'Node',
        Target: identifier,
        Duration: 0,
        PathType: 'Linear'
      });
    } else {
      luaApi?.pathnavigation.createPath({
        TargetType: 'Node',
        Target: identifier,
        PathType: 'Linear'
      });
    }
    // stop propagation?
    onFinish?.();
  }

  function fadeTo() {
    luaApi?.pathnavigation.jumpTo(identifier);
    // stop propagation?
    onFinish?.();
  }

  function jumpToGeo() {
    if (type !== NavigationType.FlyGeo && type !== NavigationType.JumpGeo) {
      return;
    }
    luaApi?.globebrowsing.jumpToGeo(identifier, latitude, longitude, altitude);
  }

  const content: ButtonContent = {
    onClick: () => {},
    icon: <></>,
    title: '',
    tooltip: ''
  };

  switch (type) {
    case NavigationType.Jump:
      content.onClick = fadeTo;
      content.title = 'Jump to';
      content.icon = <LightningFlashIcon />;
      content.tooltip = 'Teleport to object using a fade transition';
      break;
    case NavigationType.JumpGeo:
      content.onClick = jumpToGeo;
      content.title = 'Jump to Geo';
      content.icon = <LightningFlashIcon />;
      content.tooltip = 'Teleport to position using a fade transition';
      break;
    case NavigationType.Focus:
      content.onClick = focus;
      content.title = 'Focus';
      content.icon = <FocusIcon />;
      content.tooltip = (
        <span>
          Focus the object (set as anchor). Hold <Kbd>Shift</Kbd> when clicking to focus
          without retargeting
        </span>
      );
      break;
    case NavigationType.Fly:
      content.onClick = flyTo;
      content.title = 'Fly to';
      content.icon = <AirplaneIcon />;
      content.tooltip = (
        <span>
          Trigger a flight to the object. Hold <Kbd>Shift</Kbd> when clicking to instantly
          teleport/jump
        </span>
      );
      break;
    case NavigationType.FlyGeo:
      content.onClick = flyToGeo;
      content.title = 'Fly to Geo';
      content.icon = <AirplaneIcon />;
      content.tooltip = (
        <span>
          Trigger a flight to the position. Hold <Kbd>Shift</Kbd> when clicking to
          instantly teleport/jump
        </span>
      );
      break;
    case NavigationType.Frame:
      content.onClick = zoomToFocus;
      content.title = 'Zoom to / Frame';
      content.icon = <FrameFocusIcon />;
      content.tooltip = (
        <span>
          Frame the object by moving the camera in a straigt line and rotate towards it.
          Hold <Kbd>Shift</Kbd> when clicking to do it instantaneously
        </span>
      );
      break;

    default:
      throw Error(`Unhandled NavigationType '${type}'`);
  }

  return (
    <Tooltip label={content.tooltip} multiline maw={200} openDelay={600}>
      {showLabel ? (
        <Button
          onClick={content.onClick}
          leftSection={content.icon}
          size={size}
          style={style}
          justify={justify}
          disabled={disabled}
          variant={variant ?? 'filled'}
        >
          {showLabel && content.title}
        </Button>
      ) : (
        <ActionIcon
          onClick={content.onClick}
          size={size}
          variant={variant}
          style={style}
          disabled={disabled}
          aria-label={content.title}
        >
          {content.icon}
        </ActionIcon>
      )}
    </Tooltip>
  );
}
