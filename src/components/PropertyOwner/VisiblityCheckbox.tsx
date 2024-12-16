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
  const isFadeable = fadePropertyValue !== undefined;

  const setEnabledProperty = useSubscribeToProperty(enabledUri);
  useSubscribeToProperty(fadeUri);

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);

  if (isVisible === undefined) {
    return <></>;
  }

  function setVisiblity(shouldShow: boolean, isImmediate: boolean) {
    if (!isFadeable) {
      setEnabledProperty(shouldShow);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri, isImmediate ? 0 : undefined);
    } else {
      luaApi?.fadeOut(uri, isImmediate ? 0 : undefined);
    }
  }

  function onToggleCheckboxClick(event: React.MouseEvent<HTMLInputElement>) {
    const shouldBeEnabled = event.currentTarget.checked;
    const isImmediate = event.shiftKey;
    setVisiblity(shouldBeEnabled, isImmediate);
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
        onClick={() => setVisiblity(true, true)}
        readOnly
      />
    );
  }
  return <Checkbox checked={isVisible} onClick={onToggleCheckboxClick} readOnly />;
}
