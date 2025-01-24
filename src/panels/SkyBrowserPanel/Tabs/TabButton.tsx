import { PropsWithChildren } from 'react';
import { ActionIcon, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface Props {
  text: string;
  variant?: string;
  onClick: () => void;
}

export function TabButton({
  text,
  onClick,
  variant = 'default',
  children
}: PropsWithChildren<Props>) {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={150}
      position={'bottom'}
      withArrow
      shadow={'md'}
      opened={opened}
      transitionProps={{ enterDelay: 500 }}
    >
      <Popover.Target>
        <ActionIcon
          variant={variant}
          onMouseEnter={open}
          onMouseLeave={close}
          onClick={onClick}
        >
          {children}
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size={'sm'} ta={'center'}>
          {text}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
