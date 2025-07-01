import { useTranslation } from 'react-i18next';

import { useOpenSpaceApi } from '@/api/hooks';
import { useIsSceneGraphNodeAdded } from '@/hooks/propertyOwner';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { Identifier } from '@/types/types';

import { createSceneGraphNodeTable } from './util';

export function useCreateSceneGraphNode() {
  const isSceneGraphNodeAdded = useIsSceneGraphNodeAdded();
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'notifications.duplicate-scene-graph-node'
  });

  function addFocusNode(
    globe: Identifier,
    identifier: Identifier,
    lat: number,
    long: number,
    alt: number
  ) {
    // Don't try to add scene graph node if it already exists
    if (isSceneGraphNodeAdded(identifier)) {
      dispatch(
        handleNotificationLogging(
          t('title'),
          t('description', { identifier }),
          LogLevel.Warning
        )
      );
      return;
    }

    const sgnTable = createSceneGraphNodeTable(globe, identifier, lat, long, alt);

    luaApi?.addSceneGraphNode(sgnTable);
  }

  return addFocusNode;
}
