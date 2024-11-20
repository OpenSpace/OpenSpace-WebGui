import { PropsWithChildren } from 'react';
import { ActionIcon, Collapse, Container, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

interface Props extends PropsWithChildren {
  title: string;
}
export function CollapsableContent({ title, children }: Props) {
  const [open, { toggle }] = useDisclosure();

  return (
    <>
      <Group mt={'xs'}>
        <ActionIcon onClick={toggle} variant={"default"}>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </ActionIcon>
        <Title order={4}>{title}</Title>
      </Group>
      <Collapse in={open} transitionDuration={300} my={'xs'}>
        <Container>{children}</Container>
      </Collapse>
    </>
  );
}
