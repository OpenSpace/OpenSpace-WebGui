import { ActionIcon, Center, Group, Paper, Slider, Stack, Text, Tooltip } from '@mantine/core';

import { useState } from 'react';
import { Checkbox } from '@mantine/core';
import { useAppSelector } from '@/redux/hooks';
import { useBoolProperty, useFloatProperty } from '@/hooks/properties';

import { SphereIcon, LineIcon, SingleDotIcon, HomeIcon, AbcIcon } from '@/icons/icons';
import { useOpenSpaceApi } from '@/api/hooks';

interface Props {
  title: string;
  icon: string;
  identifier?: string;
  onAction?: string;
  offAction?: string;
}


export function IconLabelButton({title, icon, identifier, onAction, offAction}: Props) {
  
  const luaApi = useOpenSpaceApi();

  function checkIdentifier() {
    if (identifier) {
      return "Scene."+identifier+".Renderable";
    } else {
      switch (onAction) {
        case 'os.nightsky.FadeInConstalltionLabels':
          return "Scene.Constellations.Renderable.Labels";
        case 'os.constellation_art.ShowArt':
          return "Scene.ImageConstellation-Ori.Renderable";
          default:
          console.log("Handle special checkbox");
          return "false";
      }
    }
  }; 

  const [enabled] = useBoolProperty(checkIdentifier()+".Enabled");
  const [identifierFaded] = useFloatProperty(checkIdentifier()+".Fade");

  
  function isChecked() {
      return enabled && identifierFaded;
  }

  function getDisplayIcon(icon: string) {
    switch (icon) {
      case 'grid':
        return (<SphereIcon size={30} />);
      case 'line':
        return (<LineIcon size={30} />);
      case 'dot':
        return (<SingleDotIcon size={30} />);
      case 'text':
        return (<AbcIcon size={30} />);
      default:
        return (<HomeIcon size={30} />);
    }
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      if (identifier) {
        luaApi?.fadeIn("Scene."+identifier+".Renderable");
      } else if (onAction) {
        luaApi?.action.triggerAction(onAction)
      }
    } else {
      if (identifier) {
        luaApi?.fadeOut("Scene."+identifier+".Renderable");
      } else if (offAction) {
        luaApi?.action.triggerAction(offAction)
      }
    }  
  }

  return (
    <Paper
          withBorder
          style={{
            borderColor: 'var(--mantine-color-gray-8)'
          }}
          p={'xs'}
        >
    {title}
    {getDisplayIcon(icon)} 
    <Checkbox
      checked={isChecked() ? true : false}
      onChange={(event) => {checkboxChange(event.currentTarget.checked)}}
    />
    </Paper>
  );
}