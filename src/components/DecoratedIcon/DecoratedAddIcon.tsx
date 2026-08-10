import { MantineSize } from '@mantine/core';

import { DecoratedIcon } from '@/components/DecoratedIcon/DecoratedIcon';
import { PlusIcon } from '@/icons/icons';

interface Props {
  baseIcon: React.ReactNode;
  size?: MantineSize;
}

/**
 * Component used to create a consistent look for icons that represents the action of
 * adding something
 */
export function DecoratedAddIcon({ baseIcon, size }: Props) {
  return (
    <DecoratedIcon position={'top-right'} size={size} decoratorIcon={<PlusIcon />}>
      {baseIcon}
    </DecoratedIcon>
  );
}
