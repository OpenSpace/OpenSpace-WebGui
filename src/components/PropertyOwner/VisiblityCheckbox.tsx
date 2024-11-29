import { Checkbox } from '@mantine/core';

import {
  useGetBoolPropertyValue,
  useGetFloatPropertyValue,
  useOpenSpaceApi,
  useSubscribeToProperty
} from '@/api/hooks';
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

  const setEnabledProperty = useSubscribeToProperty(enabledUri);
  useSubscribeToProperty(fadeUri);

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);
  const isFadeable = fadePropertyValue !== undefined;
  if (isVisible === undefined) {
    return null;
  }

  function onToggleCheckboxClick(event: React.MouseEvent<HTMLInputElement>) {
    const shouldBeEnabled = (event.target as HTMLInputElement).checked;
    const isImmediate = event.shiftKey;

    if (!isFadeable) {
      setEnabledProperty(shouldBeEnabled);
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
    return (
      <Checkbox
        checked={isVisible}
        indeterminate={isMidFade}
        variant={'outline'}
        readOnly
      />
    );
  }
  return <Checkbox checked={isVisible} onClick={onToggleCheckboxClick} readOnly />;
}
