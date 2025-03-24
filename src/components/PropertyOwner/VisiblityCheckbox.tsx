import { useEffect, useState } from 'react';
import { Checkbox } from '@mantine/core';

import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
}

export function PropertyOwnerVisibilityCheckbox({ uri }: Props) {
  const { isVisible, setVisiblity } = usePropertyOwnerVisibility(uri);

  // This is the value that is shown in the checkbox, it is not necessarily the same as
  // the isVisible value, since the checkbox can be in a transition state
  const [checked, setChecked] = useState(isVisible);
  const [isImmediate, setIsImmediate] = useState(false);

  // If the visibility is changed elsewhere we need to update the checkbox
  useEffect(() => {
    setChecked(isVisible);
  }, [isVisible]);

  if (isVisible === undefined) {
    // This is the case when there is no enabled or fade property => don't render checkbox
    return <></>;
  }

  function updateValue(shouldBeEnabled: boolean, isImmediate: boolean) {
    setVisiblity(shouldBeEnabled, isImmediate);
    setChecked(shouldBeEnabled);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Shift') {
      setIsImmediate(true);
    }
    // Set the value when the user presses enter
    if (event.key === 'Enter') {
      updateValue(!event.currentTarget.checked, isImmediate);
    }
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Shift') {
      setIsImmediate(false);
    }
  }

  return (
    <Checkbox
      checked={checked}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onChange={(event) => {
        updateValue(event.currentTarget.checked, isImmediate);
      }}
    />
  );
}
