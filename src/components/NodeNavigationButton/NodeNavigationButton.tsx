import { ActionIcon, ActionIconProps, Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import {
  AirplaneIcon,
  FocusIcon,
  FrameFocusIcon,
  LightningFlashIcon
} from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { NavigationAimKey, NavigationAnchorKey, RetargetAnchorKey } from '@/util/keys';

interface BaseProps {
  type: NavigationType;
  identifier: string;
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
  lat?: never;
  long?: never;
  alt?: never;
}

interface GeoNavigationProps extends BaseProps {
  type: NavigationType.FlyGeo | NavigationType.JumpGeo;
  lat: number;
  long: number;
  alt: number;
}

type NodeNavigationButtonProps =
  | (PathNavigationProps & BaseButtonProps)
  | (GeoNavigationProps & BaseButtonProps);

interface ButtonContent {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon: JSX.Element;
  title: string;
  info?: string;
}

export function NodeNavigationButton({
  type,
  identifier,
  showLabel,
  onFinish,
  variant,
  lat,
  long,
  alt,
  justify,
  size,
  style
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
      luaApi?.globebrowsing.flyToGeo(identifier, lat, long, alt, 0.0);
    } else {
      luaApi?.globebrowsing.flyToGeo(identifier, lat, long, alt);
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
    luaApi?.globebrowsing.jumpToGeo(identifier, lat, long, alt);
  }

  const content: ButtonContent = {
    onClick: () => {},
    icon: <></>,
    title: ''
  };

  switch (type) {
    case NavigationType.jump:
      content.onClick = fadeTo;
      content.title = 'Jump to';
      content.icon = <LightningFlashIcon />;
      break;
    case NavigationType.JumpGeo:
      content.onClick = jumpToGeo;
      content.title = 'Jump to Geo';
      content.icon = <LightningFlashIcon />;
      break;
    case NavigationType.focus:
      content.onClick = focus;
      content.title = 'Focus';
      content.icon = <FocusIcon />;
      break;
    case NavigationType.fly:
      content.onClick = flyTo;
      content.title = 'Fly to';
      content.icon = <AirplaneIcon />;
      break;
    case NavigationType.FlyGeo:
      content.onClick = flyToGeo;
      content.title = 'Fly to Geo';
      content.icon = <AirplaneIcon />;
      break;
    case NavigationType.frame:
      content.onClick = zoomToFocus;
      content.title = 'Zoom to / Frame';
      content.icon = <FrameFocusIcon size={IconSize.sm} />;
      content.info = `Focus on the target object by moving the camera in a straigt line
        and rotate towards the object`;
      break;

    default:
      throw Error(`Unhandled NavigationType '${type}'`);
  }

  return (
    <>
      {showLabel ? (
        <Button
          onClick={content.onClick}
          leftSection={content.icon}
          rightSection={content.info && <Tooltip text={content.info} />}
          size={size}
          style={style}
          justify={justify}
        >
          {showLabel && content.title}
        </Button>
      ) : (
        <ActionIcon onClick={content.onClick} size={size} variant={variant} style={style}>
          {content.icon}
        </ActionIcon>
      )}
    </>
  );
}
