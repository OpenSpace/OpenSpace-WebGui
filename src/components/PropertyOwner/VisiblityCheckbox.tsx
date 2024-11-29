import { useEffect } from 'react';
import { Checkbox } from '@mantine/core';

import {
  useGetBoolPropertyValue,
  useGetFloatPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { useAppDispatch } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { checkVisiblity } from '@/util/propertyTreeHelpers';

interface Props {
  uri: string;
}

export function PropertyOwnerVisibilityCheckbox({ uri }: Props) {
  const luaApi = useOpenSpaceApi();

  const enabledUri = `${uri}.Enabled`;
  const fadeUri = `${uri}.Fade`;
  const enabledPropertyValue = useGetBoolPropertyValue(enabledUri);
  const fadePropertyValue = useGetFloatPropertyValue(fadeUri);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToProperty({ uri: enabledUri }));
    dispatch(subscribeToProperty({ uri: fadeUri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri: enabledUri }));
      dispatch(unsubscribeToProperty({ uri: fadeUri }));
    };
  }, [dispatch, enabledUri, fadeUri]);

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);
  const isFadeable = fadePropertyValue !== undefined;
  if (isVisible === undefined) {
    return null;
  }

  function onToggleCheckboxClick(event: React.MouseEvent<HTMLInputElement>) {
    const shouldBeEnabled = (event.target as HTMLInputElement).checked;
    const isImmediate = event.shiftKey;

    if (!isFadeable) {
      dispatch(setPropertyValue({ uri: enabledUri, value: shouldBeEnabled }));
    } else if (shouldBeEnabled) {
      luaApi?.fadeIn(uri, isImmediate ? 0 : undefined);
    } else {
      luaApi?.fadeOut(uri, isImmediate ? 0 : undefined);
    }
  }

  let isMidFade = undefined;
  if (isFadeable && fadePropertyValue > 0 && fadePropertyValue < 0.99) {
    isMidFade = true;
  }
  if (isMidFade) {
    return <Checkbox checked={isVisible} indeterminate={isMidFade} variant={'outline'} />;
  }
  return <Checkbox checked={isVisible} onClick={onToggleCheckboxClick} />;
}
