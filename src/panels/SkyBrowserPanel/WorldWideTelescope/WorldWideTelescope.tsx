import { useEffect, useState } from 'react';
import { Box, Text } from '@mantine/core';

import { useGetBoolPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { useWwtProvider } from './WwtProvider/hooks';
import {
  useUpdateAim,
  useUpdateBorderColor,
  useUpdateBorderRadius,
  useUpdateOpacities,
  useUpdateSelectedImages
} from './hooks';

export function WorldWideTelescope() {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });

  const { ref } = useWwtProvider();

  const { width, height } = useWindowSize();
  const luaApi = useOpenSpaceApi();

  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const id = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const [inverseZoom] = useGetBoolPropertyValue(
    'Modules.SkyBrowser.InverseZoomDirection'
  );

  // A bunch of hooks that pass messages to WWT when our redux state changes
  useUpdateAim();
  useUpdateSelectedImages();
  useUpdateOpacities();
  useUpdateBorderRadius();
  useUpdateBorderColor();

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
    const scrollDirection = inverseZoom ? -deltaY : deltaY;
    luaApi?.skybrowser.scrollOverBrowser(id, scrollDirection);
    luaApi?.skybrowser.stopAnimations(id);
  }

  if (id === '') {
    return <Text m={'lg'}>No browser selected</Text>;
  }

  if (nBrowsers === 0) {
    return <Text m={'lg'}>No browsers</Text>;
  }

  return (
    <Box
      component={'button'}
      onMouseMove={(e) => handleDrag(e.clientX, e.clientY)}
      onMouseDown={(e) => mouseDown(e.clientX, e.clientY)}
      onMouseUp={mouseUp}
      onMouseLeave={mouseUp}
      onWheel={(e) => scroll(e.deltaY)}
      aria-label={'Dragging area for WorldWideTelescope'}
      p={'0px'}
      bg={'transparent'}
      pos={'absolute'}
      bd={'0px'}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
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
        style={{ borderWidth: 0, pointerEvents: 'none' }}
      >
        <p>ERROR: cannot display AAS WorldWide Telescope research app!</p>
      </iframe>
    </Box>
  );
}
