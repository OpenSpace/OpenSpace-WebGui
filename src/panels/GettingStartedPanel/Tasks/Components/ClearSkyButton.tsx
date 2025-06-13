import { useTranslation } from 'react-i18next';
import { Button, Group, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { SunIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

export function ClearSkyButton() {
  const luaApi = useOpenSpaceApi();
  const { setVisiblity: setVisibleBlueMarble } = usePropertyOwnerVisibility(
    'Scene.Earth.Renderable.Layers.ColorLayers.Blue_Marble'
  );

  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'components.clear-sky-button'
  });

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
      <Text>{t('info')}:</Text>
      <Button
        size={'lg'}
        leftSection={<SunIcon size={IconSize.md} />}
        onClick={showBlueMarble}
      >
        {t('label')}
      </Button>
    </Group>
  );
}
