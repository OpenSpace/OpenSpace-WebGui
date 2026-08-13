import React from 'react';
import { Paper, PaperProps } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { useProperty } from '@/hooks/properties';
import { PropertyTypeKey } from '@/types/Property/property';
import { Uri } from '@/types/types';

interface Props extends React.PropsWithChildren, PaperProps {
  children: React.ReactNode;
  name?: string;
  uri: Uri;
  type: PropertyTypeKey;
}

export function PropertyGroupContainer({ children, name, uri, type, ...props }: Props) {
  const [value, , meta] = useProperty(type, uri);
  const accessibleLabelId = React.useId();

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${uri}`);
  }

  return (
    <Paper
      p={'xs'}
      pt={5}
      bg={'transparent'}
      withBorder
      role={'group'}
      aria-labelledby={accessibleLabelId}
      {...props}
    >
      <div id={accessibleLabelId}>
        <PropertyLabel
          name={name ?? meta.guiName}
          description={meta.description}
          visibility={meta.visibility}
          uri={uri}
        />
      </div>
      {children}
    </Paper>
  );
}
