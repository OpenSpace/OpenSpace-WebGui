import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { Uri } from '@/types/types';

import { PropertyOwner } from './PropertyOwner';

interface Props {
  properties: Uri[];
  subowners: Uri[];
}

export function PropertyOwnerContent({ properties, subowners }: Props) {
  return (
    <>
      {subowners.length > 0 && (
        <Box>
          {subowners.map((subowner) => (
            <PropertyOwner key={subowner} uri={subowner} />
          ))}
        </Box>
      )}
      {properties.length > 0 && (
        <Box ml={'xs'} mt={'xs'}>
          {properties.map((property) => (
            <Property key={property} uri={property} />
          ))}
        </Box>
      )}
    </>
  );
}
