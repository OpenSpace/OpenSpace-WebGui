import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  tooltip: React.ReactNode;
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
  const { t } = useTranslation('components', { keyPrefix: 'node-navigation-button' });

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
      luaApi?.navigation.flyTo(identifier, 0.0);
    } else {
      luaApi?.navigation.flyTo(identifier);
    }
    // stop propagation?
    onFinish?.();
  }

  function flyToGeo(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (type !== NavigationType.FlyGeo && type !== NavigationType.JumpGeo) {
      return;
    }
    if (event.shiftKey) {
      luaApi?.navigation.flyToGeo(identifier, latitude, longitude, altitude, 0.0);
    } else {
      luaApi?.navigation.flyToGeo(identifier, latitude, longitude, altitude);
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
    luaApi?.navigation.jumpTo(identifier);
    // stop propagation?
    onFinish?.();
  }

  function jumpToGeo() {
    if (type !== NavigationType.FlyGeo && type !== NavigationType.JumpGeo) {
      return;
    }
    luaApi?.navigation.jumpToGeo(identifier, latitude, longitude, altitude);
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
      content.title = t('jump.title');
      content.icon = <LightningFlashIcon />;
      content.tooltip = t('jump.tooltip');
      break;
    case NavigationType.JumpGeo:
      content.onClick = jumpToGeo;
      content.title = t('jump-geo.title');
      content.icon = <LightningFlashIcon />;
      content.tooltip = t('jump-geo.tooltip');
      break;
    case NavigationType.Focus:
      content.onClick = focus;
      content.title = t('focus.title');
      content.icon = <FocusIcon />;
      content.tooltip = <Trans t={t} i18nKey={'focus.tooltip'} components={[<Kbd />]} />;
      break;
    case NavigationType.Fly:
      content.onClick = flyTo;
      content.title = t('fly.title');
      content.icon = <AirplaneIcon />;
      content.tooltip = <Trans t={t} i18nKey={'fly.tooltip'} components={[<Kbd />]} />;
      break;
    case NavigationType.FlyGeo:
      content.onClick = flyToGeo;
      content.title = t('fly-geo.title');
      content.icon = <AirplaneIcon />;
      content.tooltip = (
        <Trans t={t} i18nKey={'fly-geo.tooltip'} components={[<Kbd />]} />
      );
      break;
    case NavigationType.Frame:
      content.onClick = zoomToFocus;
      content.title = t('frame.title');
      content.icon = <FrameFocusIcon />;
      content.tooltip = <Trans t={t} i18nKey={'frame.tooltip'} components={[<Kbd />]} />;
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
