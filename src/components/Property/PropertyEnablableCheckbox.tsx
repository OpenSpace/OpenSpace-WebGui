import { Checkbox } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';

interface Props {
  uri: string;
}

export function PropertyEnablableCheckbox({ uri }: Props) {
  const isEnabled = useAppSelector(
    (state) => propertySelectors.selectById(state, uri)?.isEnabled
  );
  const luaApi = useOpenSpaceApi();

  return (
    <Checkbox
      checked={isEnabled}
      onChange={() => luaApi?.propertySetEnabled(uri, !isEnabled)}
    />
  );
}
