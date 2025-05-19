import React from 'react';
import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import { MarkingBoxLayout } from './MarkingBoxLayout';

interface Props {
  title: string;
  icon: React.JSX.Element;
}

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so loaving for now

export function ConstellationsShowArtBox({ title, icon }: Props) {
  const luaApi = useOpenSpaceApi();

  const uri = sgnRenderableUri(sgnUri('ImageConstellation-Ori'));
  const propertyOwner = usePropertyOwner(uri);
  const { isVisible } = usePropertyOwnerVisibility(uri);

  function checkboxChange(checked: boolean) {
    if (checked) {
      luaApi?.action.triggerAction('os.constellation_art.ShowArt');
    } else {
      luaApi?.action.triggerAction('os.constellation_art.HideArt');
    }
  }

  return (
    <MarkingBoxLayout
      checkbox={
        <Checkbox
          onChange={(event) => checkboxChange(event.currentTarget.checked)}
          checked={isVisible}
          aria-label={'Show constellation art'}
        />
      }
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
