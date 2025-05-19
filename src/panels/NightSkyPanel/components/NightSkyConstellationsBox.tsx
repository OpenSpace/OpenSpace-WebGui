import { Checkbox, Paper, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { AbcIcon, HomeIcon, PaintBrushIcon, PencilIcon, SphereIcon } from '@/icons/icons';

interface Props {
  title: string;
  icon: string;
  identifier?: string;
  onAction?: string;
  offAction?: string;
  elements?: boolean;
}

export function NightSkyConstellationsBox({
  title,
  icon,
  identifier,
  onAction,
  offAction,
  elements
}: Props) {
  const luaApi = useOpenSpaceApi();

  const [enabled] = useProperty('BoolProperty', checkIdentifier() + '.Enabled');
  const [elementsEnabled, setElementsEnabled] = useProperty(
    'BoolProperty',
    'Scene.Constellations.Renderable.DrawElements'
  );

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
    if (elements) {
      return enabled && elementsEnabled;
    } else {
      return enabled && identifierFaded == 1;
    }
  }

  function getDisplayIcon(icon: string) {
    switch (icon) {
      case 'grid':
        return <SphereIcon size={30} />;
      case 'text':
        return <AbcIcon size={30} />;
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
      } else if (identifier) {
        luaApi?.fadeIn('Scene.' + identifier + '.Renderable');
      }
    } else {
      if (offAction) {
        luaApi?.action.triggerAction(offAction);
      } else if (elements) {
        setElementsEnabled(false);
      } else {
        luaApi?.fadeOut('Scene.' + identifier + '.Renderable');
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
