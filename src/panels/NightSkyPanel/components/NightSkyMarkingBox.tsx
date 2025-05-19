import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { Identifier } from '@/types/types';
import { sgnUri } from '@/util/propertyTreeHelpers';

import { ToggleCard } from './ToggleCard';

interface Props {
  title: string;
  icon: React.JSX.Element;
  identifier: Identifier;
}

export function NightSkyMarkingBox({ title, icon, identifier }: Props) {
  const uri = sgnUri(identifier);
  return (
    <ToggleCard
      checkbox={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      title={title}
      icon={icon}
    />
  );
}
