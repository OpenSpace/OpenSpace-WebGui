import { ChevronUpIcon, RightClickMouseIcon } from '@/icons/icons';
import { Stack } from '@mantine/core';
import './MouseDescriptions.css';

interface Props {
  dir: 'up' | 'down';
}

function Arrows({ dir: direction }: Props) {
  const rotation = direction === 'up' ? '0deg' : '180deg';
  return (
    <Stack gap={0} align="center" style={{ rotate: rotation }} className="arrowAnimation">
      <ChevronUpIcon size={'30px'} />
      <ChevronUpIcon size={'50px'} />
    </Stack>
  );
}

export function MouseDescription() {
  return (
    <Stack gap={0} align="center">
      <Arrows dir="up" />
      <RightClickMouseIcon size={'90px'} />
      <Arrows dir="down" />
    </Stack>
  );
}
