import { PropsWithChildren } from 'react';
import { Collapse, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { CollapsableHeader } from '../CollapsableHeader/CollapsableHeader';

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
export function CollapsableContent({
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
        text={title}
        leftSection={leftSection}
        rightSection={rightSection}
        toggle={toggle}
      />
      <Collapse in={open} transitionDuration={noTransition ? 0 : 300} my={'xs'}>
        <Container>{children}</Container>
      </Collapse>
    </>
  );
}
