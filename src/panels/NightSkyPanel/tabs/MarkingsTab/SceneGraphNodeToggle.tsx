import { useTranslation } from 'react-i18next';

import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { Identifier } from '@/types/types';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import { MarkingsToggleLayout } from './MarkingsToggleLayout';

interface Props {
  title: string;
  icon: React.JSX.Element;
  /**
   * The idenfier of a scene graph node that this box represents
   */
  identifier: Identifier;
}

export function SceneGraphNodeToggle({ title, icon, identifier }: Props) {
  const { t } = useTranslation('panel-nightsky', {
    keyPrefix: 'markings.scene-graph-node-toggle'
  });
  const uri = sgnRenderableUri(sgnUri(identifier));
  const propertyOwner = usePropertyOwner(uri);

  const { isVisible, setVisibility } = usePropertyOwnerVisibility(uri);

  return (
    <MarkingsToggleLayout
      onClick={() => setVisibility(!isVisible)}
      checked={isVisible || false}
      aria-label={t('aria-label', { name: title })}
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
