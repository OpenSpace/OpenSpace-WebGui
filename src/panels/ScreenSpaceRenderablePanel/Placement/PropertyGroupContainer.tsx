import { useId } from 'react';
import { Paper, PaperProps } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyVisibility } from '@/types/Property/property';
import { Uri } from '@/types/types';

interface Props extends React.PropsWithChildren, PaperProps {
  children: React.ReactNode;
  uri: Uri;
  name: string;
  description: string;
  visibility: PropertyVisibility;
}

export function PropertyGroupContainer({
  children,
  uri,
  name,
  description,
  visibility,
  ...props
}: Props) {
  const accessibleLabelId = useId();

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
          name={name}
          description={description}
          visibility={visibility}
          uri={uri}
        />
      </div>
      {children}
    </Paper>
  );
}
