import { useTranslation } from 'react-i18next';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { CompassLargeIcon, CompassMarksIcon, CompassSmallIcon } from '@/icons/icons';
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

  // @TODO (2025-05-19, emmbr) These checks, especially against the parts of the texture
  // file names, are fragile agains file name changes. Consider more robust solution
  const data = {
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

  function isTextureEnabled(textureCheck: string): boolean {
    return texture ? texture.includes(textureCheck) : false;
  }

  function isChecked(variant: keyof typeof data): boolean {
    if (!isVisible) {
      return false;
    }
    return isTextureEnabled(data[variant].textureCheck);
  }

  function onChange(checked: boolean, variant: keyof typeof data) {
    const variantData = data[variant];
    if (checked) {
      luaApi?.action.triggerAction(variantData.showAction);
    } else {
      luaApi?.action.triggerAction(variantData.hideAction);
    }
  }

  return (
    <>
      <MarkingBoxLayout
        onClick={() => onChange(!isChecked('small'), 'small')}
        checked={isChecked('small')}
        aria-label={t('aria-labels.small')}
        title={t('buttons.small')}
        icon={<CompassSmallIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
        radio
      />
      <MarkingBoxLayout
        onClick={() => onChange(!isChecked('large'), 'large')}
        checked={isChecked('large')}
        aria-label={t('aria-labels.large')}
        title={t('buttons.large')}
        icon={<CompassLargeIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
        radio
      />
      <MarkingBoxLayout
        onClick={() => onChange(!isChecked('marks'), 'marks')}
        checked={isChecked('marks')}
        aria-label={t('aria-labels.marks')}
        title={t('buttons.marks')}
        icon={<CompassMarksIcon size={IconSize.md} />}
        isLoading={!hasLoaded}
      />
    </>
  );
}
