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
import { checkIfVisible } from '@/util/propertyTreeHelpers';

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

  const isVisible = checkIfVisible(enabledPropertyValue, fadePropertyValue);

  if (isVisible === undefined) {
    return null;
  }

  // const [isChecked, setIsChecked] = useState(isVisible);

  function onToggleCheckboxClick(event: React.ChangeEvent<HTMLInputElement>) {
    const shouldBeEnabled = event.target.checked;

    if (fadePropertyValue === undefined) {
      dispatch(setPropertyValue({ uri: enabledUri, value: shouldBeEnabled }));
    } else if (shouldBeEnabled) {
      luaApi?.fadeIn(uri);
    } else {
      luaApi?.fadeOut(uri);
    }
  }

  return <Checkbox checked={isVisible} onChange={onToggleCheckboxClick} />;
}
