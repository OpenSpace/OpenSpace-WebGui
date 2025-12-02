import { useTranslation } from 'react-i18next';
import { Chip, MantineSize } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

interface Props {
  size?: MantineSize;
}

export function FrictionControls({ size }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'friction-controls' });

  const [rotation, setRotation] = useProperty('BoolProperty', RotationalFrictionKey);
  const [zoom, setZoom] = useProperty('BoolProperty', ZoomFrictionKey);
  const [roll, setRoll] = useProperty('BoolProperty', RollFrictionKey);

  return (
    <>
      <Chip
        checked={rotation}
        onChange={() => setRotation(!rotation)}
        variant={rotation ? 'light' : 'transparent'}
        size={size}
        color={'teal'}
      >
        {t('rotation-label')}
      </Chip>
      <Chip
        checked={zoom}
        onChange={() => setZoom(!zoom)}
        variant={zoom ? 'light' : 'transparent'}
        size={size}
        color={'teal'}
      >
        {t('zoom-label')}
      </Chip>
      <Chip
        checked={roll}
        onChange={() => setRoll(!roll)}
        variant={roll ? 'light' : 'transparent'}
        size={size}
        color={'teal'}
      >
        {t('roll-label')}
      </Chip>
    </>
  );
}
