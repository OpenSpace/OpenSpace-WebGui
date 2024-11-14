import { ActionIcon, Button } from '@mantine/core';

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

interface NodeNavigationButtonProps {
  type: NavigationType;
  identifier: string;
  showLabel?: boolean;
  onFinish?: () => void;
  variant?: string;
}

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
  variant
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

  const content: ButtonContent = {
    onClick: () => {},
    icon: <></>,
    title: ''
  };

  switch (type) {
    case NavigationType.jump:
      content.onClick = fadeTo;
      content.title = 'Jump to';
      content.icon = <LightningFlashIcon size={IconSize.sm} />;
      break;
    case NavigationType.focus:
      content.onClick = focus;
      content.title = 'Focus';
      content.icon = <FocusIcon size={IconSize.sm} />;
      break;
    case NavigationType.fly:
      content.onClick = flyTo;
      content.title = 'Fly to';
      content.icon = <AirplaneIcon size={IconSize.sm} />;
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
          justify={'flex-start'}
        >
          {showLabel && content.title}
          {content.info && <Tooltip text={content.info} />}
        </Button>
      ) : (
        <ActionIcon onClick={content.onClick} size={'lg'} variant={variant}>
          {content.icon}
        </ActionIcon>
      )}
    </>
  );
}
