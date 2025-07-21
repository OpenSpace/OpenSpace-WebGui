import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';

import { PlusIcon } from '@/icons/icons';
import { Identifier } from '@/types/types';

import { useCreateSceneGraphNode } from './hooks';
import { addressUTF8 } from './util';

interface Props {
  globe: Identifier;
  identifier: Identifier;
  latitude: number;
  longitude: number;
  altitude: number;
  onClick?: () => void;
}

export function AddSceneGraphNodeButton({
  globe,
  identifier,
  latitude,
  longitude,
  altitude,
  onClick
}: Props) {
  const addSceneGraphNode = useCreateSceneGraphNode();
  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'add-scene-graph-node-button'
  });

  return (
    <Button
      onClick={() => {
        addSceneGraphNode(globe, addressUTF8(identifier), latitude, longitude, altitude);
        onClick?.();
      }}
      size={'sm'}
      leftSection={<PlusIcon />}
    >
      {t('label')}
    </Button>
  );
}
