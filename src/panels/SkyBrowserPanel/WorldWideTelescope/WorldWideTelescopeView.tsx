import { useEffect, useState } from 'react';
import { LoadingOverlay, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useBoolProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';
import { useGesture } from '@use-gesture/react';
import styles from './WorldWideTelescope.module.css';

import { useWwtProvider } from './WwtProvider/hooks';
import {
  useUpdateAim,
  useUpdateBorderColor,
  useUpdateBorderRadius,
  useUpdateOpacities,
  useUpdateSelectedImages
} from './hooks';
import { Overlay } from './Overlay';

export function WorldWideTelescopeView() {
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const id = useAppSelector((state) => state.skybrowser.selectedBrowserId);

  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });

  const { ref, imageCollectionLoaded } = useWwtProvider();
  const { width, height } = useWindowSize();
  const luaApi = useOpenSpaceApi();

  const bind = useGesture(
    {
      onDrag: (state) => {
        state.event.preventDefault();
        if (!state.wheeling && !state.pinching && state.touches === 1) {
          handleDrag(state.offset[0], state.offset[1]);
        }
      },
      onDragStart: (state) => {
        if (state.touches === 1 && !state.wheeling && !state.pinching) {
          mouseDown(state.offset[0], state.offset[1]);
        }
      },
      onDragEnd: () => mouseUp(),
      onPinch: (state) => {
        if (state.touches == 2) {
          const direction = state.direction[0];
          scroll(direction < 0 ? 50 : -50);
        }
      },
      onWheel: (state) => {
        scroll(state.event.deltaY);
      }
    },
    {
      drag: { threshold: 0.1 }, // To make it differentiate better between dragging and pinching
      eventOptions: { passive: false }
    }
  );
  const [inverseZoom] = useBoolProperty('Modules.SkyBrowser.InverseZoomDirection');
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

  function handleDrag(x: number, y: number) {
    if (!id || !isDragging) {
      return;
    }
    // Calculate pixel translation
    const dx = x - startDragPosition.x;
    const dy = y - startDragPosition.y;
    // Call lua function with relative values
    luaApi?.skybrowser.finetuneTargetPosition(id, [dx / width, dy / height]);
  }

  function mouseDown(x: number, y: number) {
    if (!id) {
      return;
    }
    luaApi?.skybrowser.startFinetuningTarget(id);
    luaApi?.skybrowser.stopAnimations(id);
    setIsDragging(true);
    setStartDragPosition({ x, y });
  }

  function mouseUp() {
    setIsDragging(false);
  }

  function scroll(deltaY: number) {
    if (!id) {
      return;
    }
    //console.log(deltaY);
    const scrollDirection = inverseZoom ? -deltaY : deltaY;
    luaApi?.skybrowser.scrollOverBrowser(id, scrollDirection);
    luaApi?.skybrowser.stopAnimations(id);
  }

  if (nBrowsers === 0) {
    return (
      <Text ta={'center'} m={'lg'}>
        There are no SkyBrowsers. Create one in the SkyBrowser panel.
      </Text>
    );
  }

  if (id === '') {
    return <Text m={'lg'}>No browser selected</Text>;
  }

  return (
    <>
      <LoadingOverlay
        visible={!imageCollectionLoaded || !cameraInSolarSystem}
        zIndex={1000}
        overlayProps={{ backgroundOpacity: 1, bg: 'dark.9' }}
        loaderProps={{
          children: <Overlay />
        }}
        transitionProps={{ transition: 'fade', duration: 500 }}
      />
      <div
        aria-label={'Dragging area for WorldWideTelescope'}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: '0px',
          margin: '0px',
          position: 'absolute'
        }}
        className={styles.dragArea}
        {...bind()}
      >
        <iframe
          ref={ref}
          id={'webpage'}
          name={'wwt'}
          title={'WorldWideTelescope'}
          src={'http://wwt.openspaceproject.com/1/gui/'}
          allow={'accelerometer; clipboard-write; gyroscope'}
          allowFullScreen
          height={height}
          width={width}
          style={{
            border: '0px solid transparent',
            pointerEvents: 'none',
            colorScheme: 'normal'
          }}
        >
          <p>ERROR: cannot display AAS WorldWide Telescope research app!</p>
        </iframe>
        {/* </Box> */}
      </div>
    </>
  );
}
