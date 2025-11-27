import { useEffect, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useDeducedVisibility } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
  label?: React.ReactNode;
}

export function DeducedVisibilityCheckbox({ uri, label }: Props) {
  const { isVisible, setVisibility } = useDeducedVisibility(uri);

  // This is the value that is shown in the checkbox, it is not necessarily the same as
  // the isVisible value, since the checkbox can be in a transition state
  const [checked, setChecked] = useState(isVisible);
  const [isImmediate, setIsImmediate] = useState(false);

  useWindowEvent('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Shift' && !event.repeat) {
      setIsImmediate(true);
    }
  });

  useWindowEvent('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Shift' && !event.repeat) {
      setIsImmediate(false);
    }
  });

  // If the visibility is changed elsewhere we need to update the checkbox
  useEffect(() => {
    setChecked(isVisible);
  }, [isVisible]);

  function updateValue(shouldBeEnabled: boolean, isImmediate: boolean) {
    setVisibility(shouldBeEnabled, isImmediate);
    setChecked(shouldBeEnabled);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Set the value when the user presses enter
    if (event.key === 'Enter') {
      updateValue(!event.currentTarget.checked, isImmediate);
    }
  }

  if (isVisible === undefined) {
    // This is the case when there is no enabled or fade property => don't render checkbox
    return <></>;
  }

  return (
    <Checkbox
      checked={checked}
      onKeyDown={onKeyDown}
      onChange={(event) => updateValue(event.currentTarget.checked, isImmediate)}
      label={label}
    />
  );
}
