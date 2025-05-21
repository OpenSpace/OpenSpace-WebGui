import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';

import { CardinalDirectionBoxVariant } from '../../types';

import { MarkingBoxLayout } from './MarkingBoxLayout';

interface Props {
  variant: CardinalDirectionBoxVariant;
  title: string;
  icon: React.JSX.Element;
}

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function CardinalDirectionsBox({ variant, title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const { isVisible } = usePropertyOwnerVisibility(
    'Scene.CardinalDirectionSphere.Renderable'
  );
  const [texture] = useProperty(
    'StringProperty',
    'Scene.CardinalDirectionSphere.Renderable.Texture'
  );

  const hasLoaded = isVisible !== undefined && texture !== undefined;

  // @TODO (2025-05-19, emmbr) These checks, expesially against the parts of the texture
  // file names, are fragile agains file name changes. Consider more robust solution
  const variantData = {
    small: {
      showAction: 'os.nightsky.ShowNeswLettersSmall',
      hideAction: 'os.nightsky.HideNesw',
      textureCheck: 'red_small.png',
      label: 'Show small cardinal directions'
    },
    large: {
      showAction: 'os.nightsky.ShowNeswLetters',
      hideAction: 'os.nightsky.HideNesw',
      textureCheck: 'red.png',
      label: 'Show large cardinal directions'
    },
    marks: {
      showAction: 'os.nightsky.AddNeswBandMarks',
      hideAction: 'os.nightsky.RemoveNeswBandMarks',
      textureCheck: '_lines_',
      label: 'Show marks on cardinal directions'
    }
  };

  const data = variantData[variant];
  if (!data) {
    throw new Error(`Invalid variant '${variant}'`);
  }

  function isTextureForVariantEnabled(): boolean {
    return texture ? texture.includes(data.textureCheck) : false;
  }

  function isChecked(): boolean {
    if (!isVisible) {
      return false;
    }
    return isTextureForVariantEnabled();
  }

  function checkboxChange(checked: boolean) {
    if (checked) {
      luaApi?.action.triggerAction(data.showAction);
    } else {
      luaApi?.action.triggerAction(data.hideAction);
    }
  }

  return (
    <MarkingBoxLayout
      checkbox={
        <Checkbox
          onChange={(event) => checkboxChange(event.currentTarget.checked)}
          checked={isChecked()}
          aria-label={data.label}
        />
      }
      title={title}
      icon={icon}
      isLoading={!hasLoaded}
    />
  );
}
