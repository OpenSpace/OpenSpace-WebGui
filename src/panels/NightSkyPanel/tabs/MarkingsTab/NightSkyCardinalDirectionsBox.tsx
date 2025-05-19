import { Checkbox, Skeleton } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';

import { CardinalDirectionBoxVariant } from '../../types';

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

  const hasLoaded = isVisible !== undefined && texture !== undefined;

  // @TODO (2025-05-19, emmbr) These checks, expesially against the parts of the texture
  // file names, are fragile agains file name changes. Consider more robust solution
  const variantData = {
    small: {
      enableAction: 'os.nightsky.ShowNeswLettersSmall',
      disableAction: 'os.nightsky.HideNesw',
      textureCheck: 'red_small.png',
      label: 'Show small cardinal directions'
    },
    large: {
      enableAction: 'os.nightsky.ShowNeswLetters',
      disableAction: 'os.nightsky.HideNesw',
      textureCheck: 'red.png',
      label: 'Show large cardinal directions'
    },
    marks: {
      enableAction: 'os.nightsky.AddNeswBandMarks',
      disableAction: 'os.nightsky.RemoveNeswBandMarks',
      textureCheck: '_lines_',
      label: 'Show marks on cardinal directions'
    }
  };

  const data = variantData[variant];
  if (!data) {
    throw new Error('Invalid variant');
  }

  function isTextureForVariantEnabled(): boolean | undefined {
    return texture ? texture.indexOf(data.textureCheck) > -1 : false;
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
    <Skeleton visible={!hasLoaded}>
      <ToggleCard
        checkbox={
          <Checkbox
            onChange={(event) => checkboxChange(event.currentTarget.checked)}
            checked={isChecked()}
            aria-label={data.label}
          />
        }
        title={title}
        icon={icon}
      />
    </Skeleton>
  );
}
