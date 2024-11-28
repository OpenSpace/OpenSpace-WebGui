import { PropsWithChildren } from 'react';
import { Collapse, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { CollapsableHeader } from '../CollapsableHeader/CollapsableHeader';

interface Props extends PropsWithChildren {
  // The title of the collapsable content.
  title: string;
  // If true, the content will not transition in or out. Helps with performance.
  noTransition?: boolean;
  // If true, the content will be open by default.
  defaultOpen?: boolean;
}
export function CollapsableContent({
  title,
  noTransition,
  defaultOpen = false,
  children
}: Props) {
  const [open, { toggle }] = useDisclosure(defaultOpen);

  return (
    <>
      <CollapsableHeader expanded={open} text={title} toggle={toggle} />
      <Collapse in={open} transitionDuration={noTransition ? 0 : 300} my={'xs'}>
        <Container>{children}</Container>
      </Collapse>
    </>
  );
}
