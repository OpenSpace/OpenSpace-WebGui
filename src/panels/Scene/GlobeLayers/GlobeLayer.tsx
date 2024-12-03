import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { useAppSelector } from '@/redux/hooks';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: string;
}

export function GlobeLayer({ uri }: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  return (
    <CollapsableContent
      title={displayName(propertyOwner!)}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      rightSection={<Tooltip text={propertyOwner?.description || 'No information'} />}
      noTransition
    >
      <PropertyOwner uri={uri} withHeader={false} />
    </CollapsableContent>
  );
}
