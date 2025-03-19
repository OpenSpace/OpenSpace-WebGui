import { Button, Group, Text } from '@mantine/core';

import { useOpenSpaceApi, usePropertyOwnerVisibility } from '@/api/hooks';
import { SunIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

export function ClearSkyButton() {
  const luaApi = useOpenSpaceApi();
  const { setVisiblity: setVisibleBlueMarble } = usePropertyOwnerVisibility(
    'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble'
  );

  function showBlueMarble() {
    luaApi?.action.triggerAction('os.earth_global_illumination');
    luaApi?.setPropertyValue(
      'Scene.Earth.Renderable.Layers.ColorLayers.*.Enabled',
      false
    );
    setVisibleBlueMarble(true);
  }

  return (
    <Group>
      <Text>Is it hard to find? Try clearing the sky:</Text>
      <Button
        size={'lg'}
        leftSection={<SunIcon size={IconSize.md} />}
        onClick={showBlueMarble}
      >
        Clear sky
      </Button>
    </Group>
  );
}
