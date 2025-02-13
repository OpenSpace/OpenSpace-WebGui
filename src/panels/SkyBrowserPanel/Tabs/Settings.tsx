import { Button, ColorInput, Stack, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { useSelectedBrowserColorString, useSkyBrowserIds } from '../hooks';

interface Props {
  id: string | undefined;
}

export function Settings({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const color = useSelectedBrowserColorString();
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const browserIds = useSkyBrowserIds();

  function setColor(newColor: string) {
    const parsedColor = newColor.match(/\d+/g)?.map(Number);
    if (!parsedColor) {
      return;
    }
    const [r, g, b] = parsedColor;
    luaApi?.skybrowser.setBorderColor(selectedBrowserId, r, g, b);
  }

  function deleteBrowser() {
    if (!id) {
      return;
    }
    // If there are more browsers, select another browser
    if (browserIds.length > 1) {
      const otherBrowsers = browserIds.filter((b) => b !== id);
      luaApi?.skybrowser.setSelectedBrowser(otherBrowsers[0]);
    }
    luaApi?.skybrowser.removeTargetBrowserPair(id);
  }

  return (
    <Stack gap={5} my={'lg'}>
      <Title order={2}>Settings</Title>
      <ColorInput
        label={'Color'}
        placeholder={'Set browser color...'}
        format={'rgb'}
        defaultValue={color}
        onChange={setColor}
      />
      <Button variant={'outline'} color={'red'} onClick={deleteBrowser} mt={'lg'}>
        Delete browser
      </Button>
    </Stack>
  );
}
