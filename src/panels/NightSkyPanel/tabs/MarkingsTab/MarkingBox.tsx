import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { usePropertyOwner } from '@/hooks/propertyOwner';
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

export function NightSkyMarkingBox({ title, icon, identifier }: Props) {
  const uri = sgnRenderableUri(sgnUri(identifier));
  const propertyOwner = usePropertyOwner(uri);

  return (
    <MarkingBoxLayout
      checkbox={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      title={title}
      icon={icon}
      isLoading={!propertyOwner}
    />
  );
}
