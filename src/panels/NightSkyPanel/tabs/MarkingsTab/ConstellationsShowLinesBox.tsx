import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import { MarkingBoxLayout } from './MarkingBoxLayout';

interface Props {
  title: string;
  icon: React.JSX.Element;
}

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function ConstellationShowLinesBox({ title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const uri = sgnRenderableUri(sgnUri('Constellations'));
  const propertyOwner = usePropertyOwner(uri);
  const { isVisible } = usePropertyOwnerVisibility(uri);

  const [elementsEnabled, setElementsEnabled] = useProperty(
    'BoolProperty',
    'Scene.Constellations.Renderable.DrawElements'
  );
  const { t } = useTranslation('panel-nightsky', {
    keyPrefix: 'markings.constellations.aria-labels'
  });

  function checkboxChange(checked: boolean) {
    if (checked) {
      luaApi?.action.triggerAction('os.nightsky.ShowConstellationElements');
    } else {
      setElementsEnabled(false);
    }
  }

  return (
    <MarkingBoxLayout
      checkbox={
        <Checkbox
          onChange={(event) => checkboxChange(event.currentTarget.checked)}
          checked={isVisible && elementsEnabled}
          aria-label={t('lines')}
        />
      }
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
