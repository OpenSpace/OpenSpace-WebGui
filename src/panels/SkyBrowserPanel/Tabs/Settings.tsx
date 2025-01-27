import { Button, ColorInput, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { useSelectedBrowserColorString } from '../hooks';

interface Props {
  id: string | undefined;
}

export function Settings({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const color = useSelectedBrowserColorString();
  const selectedBrowser = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const browserIds = Object.keys(browsers);

  function setColor(newColor: string) {
    const [r, g, b] = newColor
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map((val) => parseInt(val, 10));

    luaApi?.skybrowser.setBorderColor(selectedBrowser, r, g, b);
  }

  function deleteBrowser() {
    if (!id) {
      return;
    }
    // If there are more browsers, select another browser
    if (browserIds.length > 1) {
      const index = browserIds.indexOf(id);
      if (index > -1) {
        browserIds.splice(index, 1); // 2nd parameter means remove one item only
      }
      luaApi?.skybrowser.setSelectedBrowser(browserIds[0]);
    }
    luaApi?.skybrowser.removeTargetBrowserPair(id);
  }

  return (
    <>
      <Title>Settings</Title>
      <ColorInput
        label={'Color'}
        placeholder={'Set browser color...'}
        format={'rgb'}
        defaultValue={color}
        onChange={setColor}
      />
      <Button color={'red'} onClick={deleteBrowser}>
        Delete browser
      </Button>
    </>
  );
}
