import { Skeleton } from '@mantine/core';

import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Identifier } from '@/types/types';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

import { ToggleCard } from './ToggleCard';

interface Props {
  title: string;
  icon: React.JSX.Element;
  identifier: Identifier;
}

export function NightSkyMarkingBox({ title, icon, identifier }: Props) {
  const uri = sgnRenderableUri(sgnUri(identifier));
  const propertyOwner = usePropertyOwner(uri);

  return (
    <Skeleton visible={!propertyOwner}>
      <ToggleCard
        checkbox={<PropertyOwnerVisibilityCheckbox uri={uri} />}
        title={title}
        icon={icon}
      />
    </Skeleton>
  );
}
