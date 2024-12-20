import { useEffect, useState } from 'react';
import { Checkbox } from '@mantine/core';

import {
  useGetBoolPropertyValue,
  useGetFloatPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { checkVisiblity } from '@/util/propertyTreeHelpers';

interface Props {
  uri: string;
}

export function PropertyOwnerVisibilityCheckbox({ uri }: Props) {
  const luaApi = useOpenSpaceApi();

  const enabledUri = `${uri}.Enabled`;
  const fadeUri = `${uri}.Fade`;
  const [enabledPropertyValue, setEnabledProperty] = useGetBoolPropertyValue(enabledUri);
  const [fadePropertyValue] = useGetFloatPropertyValue(fadeUri);
  const isFadeable = fadePropertyValue !== undefined;

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);
  const [checked, setChecked] = useState(isVisible);

  useEffect(() => {
    setChecked(isVisible);
  }, [isVisible]);

  if (isVisible === undefined) {
    // This is the case when there is no enabled or fade property => don't render checkbox
    return <></>;
  }

  function setVisiblity(shouldShow: boolean, isImmediate: boolean) {
    const fadeTime = isImmediate ? 0 : undefined;
    if (!isFadeable) {
      setEnabledProperty(shouldShow);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri, fadeTime);
    } else {
      luaApi?.fadeOut(uri, fadeTime);
    }
    setChecked(shouldShow);
  }

  function onToggleCheckboxClick(event: React.MouseEvent<HTMLInputElement>) {
    const shouldBeEnabled = event.currentTarget.checked;
    const isImmediate = event.shiftKey;
    setVisiblity(shouldBeEnabled, isImmediate);
  }

  return <Checkbox checked={checked} onClick={onToggleCheckboxClick} readOnly />;
}
