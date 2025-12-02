import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingOverlay, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { useWwtProvider } from './WwtProvider/hooks';
import {
  useOverlayStatus,
  useUpdateAim,
  useUpdateBorderColor,
  useUpdateBorderRadius,
  useUpdateOpacities,
  useUpdateSelectedImages,
  useWwtInteraction
} from './hooks';
import { InfoOverlayContent } from './InfoOverlayContent';

import styles from './WorldWideTelescope.module.css';

export function WorldWideTelescopeView() {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'wwt.telescope-view' });

  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const id = useAppSelector((state) => state.skybrowser.selectedBrowserId);

  const { ref } = useWwtProvider();
  const { width, height } = useWindowSize();

  const { bindGestures, isDragging } = useWwtInteraction(id, width, height);

  const luaApi = useOpenSpaceApi();
  const { visible, type: overlayType } = useOverlayStatus();

  // A bunch of hooks that pass messages to WWT when our redux state changes
  useUpdateAim(id);
  useUpdateSelectedImages(id);
  useUpdateOpacities(id);
  useUpdateBorderRadius(id);
  useUpdateBorderColor(id);

  useEffect(() => {
    if (!id) {
      return;
    }
    const ratio = width / height;
    luaApi?.skybrowser.setBrowserRatio(id, ratio);
  }, [width, height, id, luaApi?.skybrowser]);

  if (nBrowsers === 0) {
    return (
      <Text ta={'center'} m={'lg'}>
        {t('no-skybrowser')}
      </Text>
    );
  }

  if (id === '') {
    return <Text m={'lg'}>{t('no-id')}</Text>;
  }

  return (
    <>
      <LoadingOverlay
        visible={visible}
        overlayProps={{ backgroundOpacity: 1, bg: 'dark.9' }}
        loaderProps={{
          children: <InfoOverlayContent type={overlayType} />
        }}
        transitionProps={{ transition: 'fade', duration: 500 }}
      />
      <div
        aria-label={t('drag-area-aria-label')}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          height: '100%',
          width: '100%'
        }}
        className={styles.dragArea}
        {...bindGestures()}
      >
        <iframe
          ref={ref}
          id={'webpage'}
          name={'wwt'}
          title={'WorldWideTelescope'}
          src={'http://wwt.openspaceproject.com/1/gui/'}
          allow={'accelerometer; clipboard-write; gyroscope'}
          allowFullScreen
          height={'100%'}
          width={'100%'}
          style={{
            border: '0px solid transparent',
            pointerEvents: 'none',
            colorScheme: 'normal'
          }}
        >
          <p>{t('error')}</p>
        </iframe>
      </div>
    </>
  );
}
