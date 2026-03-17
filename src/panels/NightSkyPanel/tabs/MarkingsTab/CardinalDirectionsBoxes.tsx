import { useTranslation } from 'react-i18next';
import { Checkbox, Radio } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { CompassLargeIcon, CompassSmallIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { MarkingBoxLayout } from './MarkingBoxLayout';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function CardinalDirectionsBoxes() {
  const { t } = useTranslation('panel-nightsky', {
    keyPrefix: 'markings.cardinal-directions'
  });

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
      textureCheck: 'red_small.png'
    },
    large: {
      showAction: 'os.nightsky.ShowNeswLetters',
      hideAction: 'os.nightsky.HideNesw',
      textureCheck: 'red.png'
    },
    marks: {
      showAction: 'os.nightsky.AddNeswBandMarks',
      hideAction: 'os.nightsky.RemoveNeswBandMarks',
      textureCheck: '_lines_'
    }
  };

  function isTextureForVariantEnabled(variant: keyof typeof variantData): boolean {
    const data = variantData[variant];
    return texture ? texture.includes(data.textureCheck) : false;
  }

  function isChecked(variant: keyof typeof variantData): boolean {
    if (!isVisible) {
      return false;
    }
    return isTextureForVariantEnabled(variant);
  }

  function onChange(checked: boolean, variant: keyof typeof variantData) {
    const data = variantData[variant];
    if (checked) {
      luaApi?.action.triggerAction(data.showAction);
    } else {
      luaApi?.action.triggerAction(data.hideAction);
    }
  }

  return (
    <>
      <MarkingBoxLayout
        checkbox={
          <Radio
            onChange={(event) => onChange(event.currentTarget.checked, 'small')}
            checked={isChecked('small')}
            aria-label={t('aria-labels.small')}
          />
        }
        title={t('buttons.small')}
        icon={<CompassSmallIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
      />
      <MarkingBoxLayout
        checkbox={
          <Radio
            onChange={(event) => onChange(event.currentTarget.checked, 'large')}
            checked={isChecked('large')}
            aria-label={t('aria-labels.large')}
          />
        }
        title={t('buttons.large')}
        icon={<CompassLargeIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
      />
      <MarkingBoxLayout
        checkbox={
          <Checkbox
            onChange={(event) => onChange(event.currentTarget.checked, 'marks')}
            checked={isChecked('marks')}
            aria-label={t('aria-labels.marks')}
          />
        }
        title={t('buttons.marks')}
        icon={<CompassLargeIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
      />
    </>
  );
}
