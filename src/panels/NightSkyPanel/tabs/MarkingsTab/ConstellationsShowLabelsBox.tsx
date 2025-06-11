import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';

import { MarkingBoxLayout } from './MarkingBoxLayout';

interface Props {
  title: string;
  icon: React.JSX.Element;
}

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function ConstellationsShowLabelsBox({ title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const uri = 'Scene.Constellations.Renderable.Labels';
  const propertyOwner = usePropertyOwner(uri);
  const { isVisible } = usePropertyOwnerVisibility(uri);
  const { t } = useTranslation('panel-nightsky', {
    keyPrefix: 'markings.constellations'
  });

  function checkboxChange(checked: boolean) {
    if (checked) {
      luaApi?.action.triggerAction('os.nightsky.FadeInConstellationLabels');
    } else {
      luaApi?.action.triggerAction('os.nightsky.FadeOutConstellationLabels');
    }
  }

  return (
    <MarkingBoxLayout
      checkbox={
        <Checkbox
          onChange={(event) => checkboxChange(event.currentTarget.checked)}
          checked={isVisible}
          aria-label={t('aria-labels.labels')}
        />
      }
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
