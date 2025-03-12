import { Group, MantineStyleProps, Stack } from '@mantine/core';

import {
  ChevronUpIcon,
  LeftClickMouseIcon,
  RightClickMouseIcon,
  ScrollClickMouseIcon
} from '@/icons/icons';

import { DragDirection, MouseInteraction } from './types';

import styles from './Mouse.module.css';

interface Props {
  dir: 'up' | 'down' | 'left' | 'right';
}

const rotations = {
  up: '0deg',
  down: '180deg',
  left: '90deg',
  right: '-90deg'
};

function Arrows({ dir }: Props) {
  return (
    <Stack
      gap={0}
      align={'center'}
      style={{ rotate: rotations[dir] }}
      className={styles.arrowAnimation}
    >
      <ChevronUpIcon size={'30px'} />
      <ChevronUpIcon size={'50px'} />
    </Stack>
  );
}

interface MouseProps {
  mouseClick: MouseInteraction;
}

function MouseBase({ mouseClick }: MouseProps) {
  return (
    <>
      {mouseClick === 'right' && <RightClickMouseIcon size={'90px'} />}
      {mouseClick === 'left' && <LeftClickMouseIcon size={'90px'} />}
      {mouseClick === 'scroll' && <ScrollClickMouseIcon size={'90px'} />}
    </>
  );
}

interface MouseDescriptionProps extends MantineStyleProps {
  mouseClick: MouseInteraction;
  arrowDir: DragDirection;
}

export function Mouse({ mouseClick, arrowDir, ...style }: MouseDescriptionProps) {
  if (arrowDir === 'vertical') {
    return (
      <Stack gap={0} align={'center'} m={'lg'} {...style}>
        <Arrows dir={'up'} />
        <MouseBase mouseClick={mouseClick} />
        <Arrows dir={'down'} />
      </Stack>
    );
  } else {
    return (
      <Group wrap={'nowrap'} px={'lg'} {...style}>
        <Arrows dir={'right'} />
        <MouseBase mouseClick={mouseClick} />
        <Arrows dir={'left'} />
      </Group>
    );
  }
}
