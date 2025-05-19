import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';

import { CardinalDirectionBoxVariant } from '../types';

import { ToggleCard } from './ToggleCard';

interface Props {
  variant: CardinalDirectionBoxVariant;
  title: string;
  icon: React.JSX.Element;
}

export function NightSkyCardinalDirectionsBox({ variant, title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const { isVisible } = usePropertyOwnerVisibility(
    'Scene.CardinalDirectionSphere.Renderable'
  );
  const [texture] = useProperty(
    'StringProperty',
    'Scene.CardinalDirectionSphere.Renderable.Texture'
  );

  const variantData = {
    small: {
      enableAction: 'os.nightsky.ShowNeswLettersSmall',
      disableAction: 'os.nightsky.HideNesw',
      textureCheckString: 'red_small.png'
    },
    large: {
      enableAction: 'os.nightsky.ShowNeswLetters',
      disableAction: 'os.nightsky.HideNesw',
      textureCheckString: 'red.png'
    },
    marks: {
      enableAction: 'os.nightsky.AddNeswBandMarks',
      disableAction: 'os.nightsky.RemoveNeswBandMarks',
      textureCheckString: '_lines_'
    }
  };

  const data = variantData[variant];
  if (!data) {
    throw new Error('Invalid variant');
  }

  function isTextureForVariantEnabled(): boolean | undefined {
    return texture ? texture.indexOf(data.textureCheckString) > -1 : false;
  }

  function isChecked(): boolean {
    if (!isVisible) {
      return false;
    } else if (isTextureForVariantEnabled()) {
      return true;
    }
    return false;
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      luaApi?.action.triggerAction(data.enableAction);
    } else {
      luaApi?.action.triggerAction(data.disableAction);
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
