import { Button, ColorInput, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { useSelectedBrowserColor } from '../hooks';

interface Props {
  id: string | undefined;
}

export function Settings({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const color = useSelectedBrowserColor();
  const selectedBrowser = useAppSelector((state) => state.skybrowser.selectedBrowserId);

  function setColor(newColor: string) {
    const [r, g, b] = newColor
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map((val) => parseInt(val, 10));

    luaApi?.skybrowser.setBorderColor(selectedBrowser, r, g, b);
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
      <Button
        color={'red'}
        onClick={() => id && luaApi?.skybrowser.removeTargetBrowserPair(id)}
      >
        Delete browser
      </Button>
    </>
  );
}
