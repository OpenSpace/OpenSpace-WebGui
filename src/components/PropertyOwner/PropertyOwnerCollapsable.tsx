import React, { PropsWithChildren } from 'react';
import { Box } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import CopyUriButton from '../CopyUriButton/CopyUriButton';

import { PropertyOwnerVisibilityCheckbox } from './VisiblityCheckbox';

interface Props extends PropsWithChildren {
  uri: Uri;
  title: React.ReactNode;
  expandedOnDefault?: boolean;
}

export function PropertyOwnerCollapsable({
  uri,
  title,
  expandedOnDefault = false,
  children
}: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  return (
    <Collapsable
      title={title}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      rightSection={
        propertyOwner.description && (
          <InfoBox>
            {propertyOwner.description}
            <CopyUriButton uri={uri} />
          </InfoBox>
        )
      }
      defaultOpen={expandedOnDefault}
      noTransition
    >
      <Box style={{ borderLeft: '2px solid var(--mantine-color-dark-5)' }}>
        {children}
      </Box>
    </Collapsable>
  );
}
