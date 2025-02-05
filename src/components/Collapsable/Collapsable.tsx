import { PropsWithChildren } from 'react';
import { Box, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconSize } from '@/types/enums';

import { CollapsableHeader } from './CollapsableHeader/CollapsableHeader';

interface Props extends PropsWithChildren {
  // The title of the collapsable content.
  title: React.ReactNode;
  // If true, the content will not transition in or out. Helps with performance.
  noTransition?: boolean;
  // If true, the content will be open by default.
  defaultOpen?: boolean;
  // Optional content to be rendered to the left of the title, but after the chevron.
  leftSection?: React.ReactNode;
  // Optional content to be rendered to the right of the title.
  rightSection?: React.ReactNode;
}
export function Collapsable({
  title,
  noTransition,
  defaultOpen = false,
  leftSection,
  rightSection,
  children
}: Props) {
  const [open, { toggle }] = useDisclosure(defaultOpen);

  return (
    <>
      <CollapsableHeader
        expanded={open}
        title={title}
        leftSection={leftSection}
        rightSection={rightSection}
        toggle={toggle}
      />
      <Collapse in={open} transitionDuration={noTransition ? 0 : 300}>
        {/* Note that the margin here is set to somewhat align with the header's icon size */}
        <Box ml={IconSize.md}>{children}</Box>
      </Collapse>
    </>
  );
}
