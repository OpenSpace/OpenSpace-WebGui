import { useEffect, useState } from 'react';
import { ActionIcon, Checkbox } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertyTree/propertySlice';
import { Uri, Visibility } from '@/types/types';
import { fadePropertyUri } from '@/util/uris';

import { RadialSweepIcon } from './ProgressIcon';

interface Props {
  uri: Uri;
  label?: React.ReactNode;
  visibility: Visibility | undefined;
  setVisibility: (shouldBeEnabled: boolean, isImmediate: boolean) => void;
}

export function PropertyOwnerVisibilityCheckbox({
  uri,
  label,
  visibility,
  setVisibility
}: Props) {
  // This is the value that is shown in the checkbox, it is not necessarily the same as
  // the visibility value, since the checkbox can be in a transition state
  const [checked, setChecked] = useState(visibility === 'Visible');
  const [isImmediate, setIsImmediate] = useState(false);
  const fade = useAppSelector(
    (state) =>
      propertySelectors.selectById(state, fadePropertyUri(uri))?.value as
        | number
        | undefined
  );
  useEffect(() => {
    setChecked(visibility === 'Visible');
  }, [visibility]);

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

  function updateValue(shouldBeEnabled: boolean, isImmediate: boolean) {
    setVisibility(shouldBeEnabled, isImmediate);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Set the value when the user presses enter
    if (event.key === 'Enter') {
      updateValue(!event.currentTarget.checked, isImmediate);
    }
  }

  if (visibility === 'Fading' && fade !== undefined) {
    return (
      <ActionIcon size={20}>
        <RadialSweepIcon value={fade * 100} background={'transparent'} size={20} />
      </ActionIcon>
    );
  }

  if (visibility === undefined) {
    // This is the case when there is no enabled or fade property => don't render checkbox
    return <></>;
  }

  return (
    <Checkbox
      checked={checked}
      indeterminate={visibility === 'Fading'}
      onKeyDown={onKeyDown}
      onChange={(event) => updateValue(event.currentTarget.checked, isImmediate)}
      label={label}
    />
  );
}
