import { MdDragHandle } from 'react-icons/md';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Group, Paper, Text, ThemeIcon } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { useAppSelector } from '@/redux/hooks';
import { subscribeToProperty } from '@/redux/propertytree/properties/propertiesMiddleware';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: string;
  showDragHandle?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function GlobeLayer({ uri, showDragHandle, dragHandleProps }: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  const isEnabled = useGetBoolPropertyValue(`${uri}.Enabled`);
  subscribeToProperty({ uri: `${uri}.Enabled` });

  // @TODO (emmbr, 2024-12-06): We want to avoid hardcoded colors, but since changing the
  // color of the text is a feature we wanted to keep I decided to do it this way for now.
  const textColor = isEnabled ? 'white' : 'dimmed';

  return (
    <CollapsableContent
      title={<Text c={textColor}>{displayName(propertyOwner!)}</Text>}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      rightSection={
        <Group wrap={'nowrap'}>
          <Tooltip text={propertyOwner?.description || 'No information'} />
          {showDragHandle && dragHandleProps && (
            <ThemeIcon variant={'default'} {...dragHandleProps}>
              <MdDragHandle />
            </ThemeIcon>
          )}
        </Group>
      }
      noTransition
    >
      <Paper withBorder>
        <PropertyOwner uri={uri} withHeader={false} />
      </Paper>
    </CollapsableContent>
  );
}
