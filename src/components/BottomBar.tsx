import { Button, Flex } from '@mantine/core';

import { WindowOptions } from '@/components/WindowLayout';

import { SessionRec } from './SessionRec';

interface BottomBarProps {
  addWindow: (component: JSX.Element, options: WindowOptions) => void;
}

export function BottomBar({ addWindow }: BottomBarProps) {
  return (
    <>
      <Flex>
        <Button
          onClick={() => {
            addWindow(<SessionRec />, { title: 'Session Recording', position: 'left' });
          }}
        >
          Open session rec
        </Button>
      </Flex>
    </>
  );
}
