import { PropsWithChildren, useEffect, useState } from 'react';
import { Checkbox, CheckboxCardProps } from '@mantine/core';

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
      checked={checkedState}
      onClick={handleClick}
      {...other}
      bg={checkedState ? 'blue' : 'dark.8'}
      role={'switch'}
      aria-checked={checkedState}
      style={checkedState ? { fontWeight: '500' } : undefined}
    >
      {children}
    </Checkbox.Card>
  );
}
