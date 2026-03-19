import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { Identifier } from '@/types/types';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import { MarkingBoxLayout } from './MarkingBoxLayout';

interface Props {
  title: string;
  icon: React.JSX.Element;
  /**
   * The idenfier of a scene graph node that this box represents
   */
  identifier: Identifier;
}

export function SceneGraphNodeBox({ title, icon, identifier }: Props) {
  const uri = sgnRenderableUri(sgnUri(identifier));
  const propertyOwner = usePropertyOwner(uri);

  const { isVisible, setVisibility } = usePropertyOwnerVisibility(uri);

  return (
    <MarkingBoxLayout
      onClick={() => setVisibility(!isVisible)}
      checked={isVisible || false}
      aria-label={title} // TODO: Update with correct aria-label
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
