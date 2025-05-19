import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { AbcIcon, HomeIcon, PaintBrushIcon, PencilIcon, SphereIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { ToggleCard } from './ToggleCard';

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
  const uri = identifier ? 'Scene.' + identifier + '.Renderable' : '';
  const luaApi = useOpenSpaceApi();

  const [enabled] = useProperty('BoolProperty', `${uri}.Enabled`);
  const [elementsEnabled, setElementsEnabled] = useProperty(
    'BoolProperty',
    'Scene.Constellations.Renderable.DrawElements'
  );

  const [identifierFaded] = useProperty('FloatProperty', `${uri}.Fade`);

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
        return <SphereIcon size={IconSize.md} />;
      case 'text':
        return <AbcIcon size={IconSize.md} />;
      case 'pencil':
        return <PencilIcon size={IconSize.md} />;
      case 'paint':
        return <PaintBrushIcon size={IconSize.md} />;
      default:
        return <HomeIcon size={IconSize.md} />;
    }
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      if (onAction) {
        luaApi?.action.triggerAction(onAction);
      } else if (identifier) {
        luaApi?.fadeIn(uri);
      }
    } else {
      if (offAction) {
        luaApi?.action.triggerAction(offAction);
      } else if (elements) {
        setElementsEnabled(false);
      } else {
        luaApi?.fadeOut(uri);
      }
    }
  }

  return (
    <ToggleCard
      checkbox={
        <Checkbox
          onChange={(event) => checkboxChange(event.currentTarget.checked)}
          checked={isChecked()}
        />
      }
      title={title}
      icon={getDisplayIcon(icon)}
    />
  );
}
