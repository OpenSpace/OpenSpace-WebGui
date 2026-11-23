import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';

interface Props {
  uri: string;
}

export function PropertyEnablableCheckbox({ uri }: Props) {
  const isEnabled = useAppSelector((state) => {
    const property = propertySelectors.selectById(state, uri);
    // Trigger and boolean properties have no isEnabled so we need to check first
    return property && 'isEnabled' in property ? property.isEnabled : null;
  });
  const luaApi = useOpenSpaceApi();

  // This should never happend but guarding for it gracefully
  if (isEnabled === null) {
    return null;
  }

  return (
    <Checkbox
      checked={isEnabled}
      onChange={() => luaApi?.setPropertyEnabledSingle(uri, !isEnabled)}
    />
  );
}
