import { PropsWithChildren, useEffect, useState } from 'react';
import { Checkbox, CheckboxCardProps } from '@mantine/core';

import styles from './ToggleCard.module.css';

interface Props extends CheckboxCardProps, PropsWithChildren {
  onClick: () => void;
  checked: boolean;
}

export function ToggleCard({ onClick, checked, children, ...other }: Props) {
  const [checkedState, setCheckedState] = useState(checked);

  function handleClick() {
    setCheckedState(!checkedState);
    onClick();
  }

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  return (
    <Checkbox.Card
      classNames={styles}
      checked={checkedState}
      onClick={handleClick}
      bg={checkedState ? 'blue' : 'dark.8'}
      role={'switch'}
      aria-checked={checkedState}
      style={{ fontWeight: checkedState ? '500' : undefined }}
      {...other}
    >
      {children}
    </Checkbox.Card>
  );
}
