import { PropsWithChildren } from 'react';
import { Collapse, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { CollapsableHeader } from '../CollapsableHeader/CollapsableHeader';

interface Props extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}
export function CollapsableContent({ title, defaultOpen = false, children }: Props) {
  const [open, { toggle }] = useDisclosure(defaultOpen);

  return (
    <>
      <CollapsableHeader expanded={open} text={title} toggle={toggle} />
      <Collapse in={open} transitionDuration={300} my={'xs'}>
        <Container>{children}</Container>
      </Collapse>
    </>
  );
}
