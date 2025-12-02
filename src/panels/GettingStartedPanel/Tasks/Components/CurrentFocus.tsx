import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { useSceneGraphNode } from '@/hooks/propertyOwner';
import { NavigationAnchorKey } from '@/util/keys';

export function CurrentFocus() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'components.current-focus'
  });

  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);
  const currentAnchorNode = useSceneGraphNode(currentAnchor ?? '');

  return (
    <Text>
      {t('label')}: {currentAnchorNode?.name ?? t('none')}
    </Text>
  );
}
