import { Group, Kbd } from '@mantine/core';

import { Mouse } from './Mouse';
import { DragDirection, MouseInteraction } from './types';

interface MouseWithModifierProps {
  modifier: string;
  mouseClick: MouseInteraction;
  arrowDir: DragDirection;
}

export function MouseWithModifier({
  modifier,
  mouseClick,
  arrowDir
}: MouseWithModifierProps) {
  return (
    <Group wrap={'nowrap'} justify={'right'}>
      <Kbd size={'lg'}>{modifier}</Kbd>
      <Mouse mouseClick={mouseClick} arrowDir={arrowDir} m={'lg'} />
    </Group>
  );
}
