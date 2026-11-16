import { MantineSize } from '@mantine/core';

import {
  DecoratedIcon,
  DecoratedIconProps
} from '@/components/DecoratedIcon/DecoratedIcon';
import { PlusIcon } from '@/icons/icons';

export interface Props extends DecoratedIconProps {
  baseIcon: React.JSX.Element;
  size?: MantineSize;
}

/**
 * Component used to create a consistent look for icons that represents the action of
 * adding something
 */
export function DecoratedAddIcon({ baseIcon, size, ...rest }: Props) {
  return (
    <DecoratedIcon
      position={'top-right'}
      size={size}
      decoratorIcon={<PlusIcon />}
      {...rest}
    >
      {baseIcon}
    </DecoratedIcon>
  );
}
