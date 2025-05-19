import { Checkbox, Paper, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import {
  CompassLargeIcon,
  CompassMarksIcon,
  CompassSmallIcon,
  HomeIcon
} from '@/icons/icons';

import { CardinalDirectionBoxVariant, MarkingIcon } from '../types';

interface Props {
  variant: CardinalDirectionBoxVariant;
  title: string;
  icon: MarkingIcon;
}

export function NightSkyCardinalDirectionsBox({ variant, title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const [showingDirections] = useProperty(
    'BoolProperty',
    'Scene.CardinalDirectionSphere.Renderable.Enabled'
  );
  const [directionsTexture] = useProperty(
    'StringProperty',
    'Scene.CardinalDirectionSphere.Renderable.Texture'
  );
  const [directionsFaded] = useProperty(
    'FloatProperty',
    'Scene.CardinalDirectionSphere.Renderable.Fade'
  );

  function getDisplayIcon(icon: string) {
    switch (icon) {
      case 'compasssmall':
        return <CompassSmallIcon size={30} />;
      case 'compasslarge':
        return <CompassLargeIcon size={30} />;
      case 'compassmarks':
        return <CompassMarksIcon size={30} />;
      default:
        return <HomeIcon size={30} />;
    }
  }

  function isChecked(): boolean {
    let directionCheck = '';
    switch (variant) {
      case 'small':
        directionCheck = 'red_small.png';
        break;
      case 'large':
        directionCheck = 'red.png';
        break;
      case 'marks':
        directionCheck = '_lines_';
        break;
      default:
        break;
    }
    if (!showingDirections || directionsFaded != 1) {
      return false;
    } else {
      if (directionsTexture && directionsTexture.indexOf(directionCheck) > -1) {
        return true;
      }
    }
    return false;
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      switch (variant) {
        case 'small':
          luaApi?.action.triggerAction('os.nightsky.ShowNeswLettersSmall');
          break;
        case 'large':
          luaApi?.action.triggerAction('os.nightsky.ShowNeswLetters');
          break;
        case 'marks':
          luaApi?.action.triggerAction('os.nightsky.AddNeswBandMarks');
          break;
        default:
          break;
      }
    } else {
      switch (variant) {
        case 'small':
          luaApi?.action.triggerAction('os.nightsky.HideNesw');
          break;
        case 'large':
          luaApi?.action.triggerAction('os.nightsky.HideNesw');
          break;
        case 'marks':
          luaApi?.action.triggerAction('os.nightsky.RemoveNeswBandMarks');
          break;
        default:
          break;
      }
    }
  }

  return (
    <Paper pt={'sm'}>
      <Stack align={'center'}>
        <Checkbox
          onChange={(event) => {
            checkboxChange(event.currentTarget.checked);
          }}
          checked={isChecked()}
        />
        {getDisplayIcon(icon)}
        <Text>{title}</Text>
      </Stack>
    </Paper>
  );
}
