import { Button, Group } from '@mantine/core';

import { WindowLayoutOptions } from '@/components/WindowLayout';

import { SessionRec } from './SessionRec';

interface TaskBarProps {
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void;
}

export function TaskBar({ addWindow }: TaskBarProps) {
  return (
    <div>
      <Group
        style={{
          backgroundColor: '#00000080',
          height: 60,
          width: 'fit-content',
          paddingRight: 40
        }}
      >
        <Button size={'xl'}>Scene</Button>
        <Button size={'xl'}>Focus</Button>
        <Button
          size={'xl'}
          onClick={() => {
            addWindow(<SessionRec />, { title: 'Session Recording', position: 'left' });
          }}
        >
          Open session rec
        </Button>
      </Group>
    </div>
  );
}
