import React from 'react';
import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { sgnUri } from '@/util/propertyTreeHelpers';

import { ToggleCard } from './ToggleCard';

interface Props {
  title: string;
  icon: React.JSX.Element;
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

  const uri = identifier ? sgnUri(identifier) : '';
  const { isVisible } = usePropertyOwnerVisibility(uri);

  const [elementsEnabled, setElementsEnabled] = useProperty(
    'BoolProperty',
    'Scene.Constellations.Renderable.DrawElements'
  );

  function isChecked() {
    if (elements) {
      return isVisible && elementsEnabled;
    } else {
      return isVisible;
    }
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      if (onAction) {
        luaApi?.action.triggerAction(onAction);
      } else if (uri) {
        luaApi?.fadeIn(uri);
      }
    } else {
      if (offAction) {
        luaApi?.action.triggerAction(offAction);
      } else if (elements) {
        setElementsEnabled(false);
      } else if (uri) {
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
      icon={icon}
    />
  );
}
