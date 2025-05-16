import { useState } from 'react';
import { Checkbox, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import {
  AbcIcon,
  BandIcon,
  CompassLargeIcon,
  CompassMarksIcon,
  CompassSmallIcon,
  HomeIcon,
  LineIcon,
  PaintBrushIcon,
  PencilIcon,
  SingleDotIcon,
  SphereIcon
} from '@/icons/icons';

interface Props {
  title: string;
  icon: string;
  identifier?: string;
  onAction?: string;
  offAction?: string;
  boolProp?: string;
  directionCheck?: string;
}

export function IconLabelButton({
  title,
  icon,
  identifier,
  onAction,
  offAction,
  directionCheck,
  boolProp
}: Props) {
  const luaApi = useOpenSpaceApi();

  const [interalCheck, setInternalCheked] = useState(false);

  let showingDirections: boolean | undefined;
  let directionsTexture: string | undefined;
  let directionsFaded: number | undefined;
  let boolEnabled: boolean | undefined;
  if (boolProp) {
    [boolEnabled] = useProperty('BoolProperty', boolProp);
  }

  const [enabled] = useProperty('BoolProperty', checkIdentifier() + '.Enabled');

  if (directionCheck) {
    [showingDirections] = useProperty(
      'BoolProperty',
      'Scene.CardinalDirectionSphere.Renderable.Enabled'
    );
    [directionsTexture] = useProperty(
      'StringProperty',
      'Scene.CardinalDirectionSphere.Renderable.Texture'
    );
    [directionsFaded] = useProperty(
      'FloatProperty',
      'Scene.CardinalDirectionSphere.Renderable.Fade'
    );
  }
  const [identifierFaded] = useProperty('FloatProperty', checkIdentifier() + '.Fade');

  function checkIdentifier() {
    if (identifier) {
      if (identifier.startsWith('Scene')) {
        return identifier;
      } else {
        return 'Scene.' + identifier + '.Renderable';
      }
    } else {
      return '';
    }
  }

  function isChecked() {
    if (!identifier) {
      if (directionCheck) {
        if (!showingDirections || directionsFaded != 1) {
          return false;
        } else {
          if (directionsTexture && directionsTexture.indexOf(directionCheck) > -1) {
            return true;
          }
        }
      } else {
        return interalCheck;
      }
    }
    if (boolProp) {
      return enabled && boolEnabled;
    } else {
      return enabled && identifierFaded == 1;
    }
  }

  function getDisplayIcon(icon: string) {
    switch (icon) {
      case 'grid':
        return <SphereIcon size={30} />;
      case 'line':
        return <LineIcon size={30} />;
      case 'dot':
        return <SingleDotIcon size={30} />;
      case 'text':
        return <AbcIcon size={30} />;
      case 'band':
        return <BandIcon size={30} />;
      case 'compasssmall':
        return <CompassSmallIcon size={30} />;
      case 'compasslarge':
        return <CompassLargeIcon size={30} />;
      case 'compassmarks':
        return <CompassMarksIcon size={30} />;
      case 'pencil':
        return <PencilIcon size={30} />;
      case 'paint':
        return <PaintBrushIcon size={30} />;
      default:
        return <HomeIcon size={30} />;
    }
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      if (onAction) {
        luaApi?.action.triggerAction(onAction);
        setInternalCheked(true);
      } else if (identifier) {
        luaApi?.fadeIn('Scene.' + identifier + '.Renderable');
      }
    } else {
      if (offAction) {
        luaApi?.action.triggerAction(offAction);
        setInternalCheked(false);
      } else if (boolProp) {
        luaApi?.setPropertyValueSingle(boolProp, false);
      } else if (identifier) {
        luaApi?.fadeOut('Scene.' + identifier + '.Renderable');
      }
    }
  }

  return (
    <Checkbox.Card
      radius={'md'}
      checked={isChecked() ? true : false}
      onChange={(event) => {
        checkboxChange(event);
      }}
    >
      <Stack align={'center'}>
        <Checkbox.Indicator />
        {getDisplayIcon(icon)}
        <Text>{title}</Text>
      </Stack>
    </Checkbox.Card>
  );
}
