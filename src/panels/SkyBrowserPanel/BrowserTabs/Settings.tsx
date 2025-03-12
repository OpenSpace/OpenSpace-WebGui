import { ColorInput, Stack, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { useBrowserColorString } from '../hooks';

interface Props {
  id: string | undefined;
}

export function Settings({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const color = useBrowserColorString(selectedBrowserId);

  function setColor(newColor: string) {
    const parsedColor = newColor.match(/\d+/g)?.map(Number);
    if (!parsedColor) {
      return;
    }
    const [r, g, b] = parsedColor;
    luaApi?.skybrowser.setBorderColor(selectedBrowserId, r, g, b);
  }

  return (
    <Stack gap={5} my={'lg'}>
      <Title order={2}>Settings</Title>
      {/* Just using this variable here so the linter is happy */}
      {id}
      <ColorInput
        label={'Color'}
        placeholder={'Set browser color...'}
        format={'rgb'}
        defaultValue={color}
        onChange={setColor}
      />
    </Stack>
  );
}
