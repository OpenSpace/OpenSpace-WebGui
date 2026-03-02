import { useEffect, useState } from 'react';
import { useGesture } from '@use-gesture/react';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyValue } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import {
  useBrowserColor,
  useBrowserCoords,
  useBrowserFov,
  useBrowserRadius,
  useOpacities,
  useSelectedImages
} from '../hooks';
import { WwtStatus } from '../types';

import { useWwtProvider } from './WwtProvider/hooks';

// These are the hooks that will keep track of the redux state and
// when it changes, it will pass along these messages to WWT

// Whenever a redux state change of the selected images is detected,
// pass messages to WWT to reflect this change.
// This adding and removal of images will be brute forced; i.e. every
// time an image is added or removed, all previously added images will be
// removed and then the new array of images is added. This is because the
// performance loss is negligible and there are many complicated cases to keep track of.
export function useUpdateSelectedImages(id: string) {
  const { imageCollectionLoaded, loadImage, removeImage } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSelectedImages(id);

  useEffect(() => {
    if (!imageList) {
      return;
    }
    const isDataLoaded = imageList.length !== 0 && selectedImages !== undefined;
    if (!isDataLoaded || !imageCollectionLoaded) {
      return;
    }

    selectedImages.toReversed().map((index) => {
      loadImage(imageList[index]?.url);
    });
    return () => selectedImages?.forEach((image) => removeImage(imageList[image].url));
  }, [imageList, selectedImages, imageCollectionLoaded, loadImage, removeImage]);
}

// Whenever a redux state change of the selected image opacities is detected,
// pass messages to WWT to reflect this change.
// We don't try to be clever here and only set the opacity that has changed;
// instead we pass messages for all the opacities whenever we detect a change.
// This because this is much easier - the performance loss is negligible and
// there are many complicated cases.
export function useUpdateOpacities(id: string) {
  const { imageCollectionLoaded, setOpacity } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSelectedImages(id);
  const opacities = useOpacities(id);

  useEffect(() => {
    if (!imageList) {
      return;
    }
    const isWwtReady = imageList.length !== 0 && imageCollectionLoaded;
    const isBrowserDataLoaded = opacities !== undefined && selectedImages !== undefined;
    if (!isWwtReady || !isBrowserDataLoaded) {
      return;
    }
    opacities.map((opacity, i) => {
      const { url } = imageList[selectedImages[i]];
      setOpacity(url, opacity);
    });
  }, [imageList, selectedImages, opacities, imageCollectionLoaded, setOpacity]);
}

// Whenever a redux state change of the aim is detected,
// pass messages to WWT to reflect this change
export function useUpdateAim(id: string) {
  const { ra, dec, roll } = useBrowserCoords(id);
  const fov = useBrowserFov(id);
  const { setAim } = useWwtProvider();

  useEffect(() => {
    setAim(ra, dec, fov, roll);
  }, [ra, dec, fov, roll, setAim]);
}

// Whenever a redux state change of the border color is detected,
// pass messages to WWT to reflect this change
export function useUpdateBorderColor(id: string) {
  const borderColor = useBrowserColor(id);
  const { wwtHasLoaded, setBorderColor } = useWwtProvider();

  useEffect(() => {
    if (borderColor !== undefined && wwtHasLoaded) {
      setBorderColor(borderColor);
    }
  }, [borderColor, wwtHasLoaded, setBorderColor]);
}

// Whenever a redux state change of the border radius is detected,
// pass messages to WWT to reflect this change
export function useUpdateBorderRadius(id: string) {
  const borderRadius = useBrowserRadius(id);
  const { setBorderRadius, wwtHasLoaded } = useWwtProvider();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (borderRadius !== undefined && wwtHasLoaded) {
      setBorderRadius(borderRadius);
    }
  }, [borderRadius, setBorderRadius, wwtHasLoaded, width, height]);
}

export function useOverlayStatus(): { visible: boolean; type: WwtStatus } {
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const { imageCollectionLoaded, wwtHasLoaded } = useWwtProvider();

  if (!cameraInSolarSystem) {
    return { visible: true, type: 'CameraNotInSolarSystem' };
  }
  if (!wwtHasLoaded) {
    return { visible: true, type: 'LoadingWwt' };
  }
  if (!imageCollectionLoaded) {
    return { visible: true, type: 'LoadingImageCollection' };
  } else {
    return { visible: false, type: 'Ok' };
  }
}

export function useWwtInteraction(id: string, width: number, height: number) {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });

  const inverseZoom = usePropertyValue(
    'BoolProperty',
    'Modules.SkyBrowser.InverseZoomDirection'
  );
  const luaApi = useOpenSpaceApi();

  /**
   * The `offset` parameter represents the accumulated distance of the drag gesture
   * in pixels. It is an array where:
   * - `offset[0]` corresponds to the horizontal distance (x-axis).
   * - `offset[1]` corresponds to the vertical distance (y-axis).
   *
   * This value is updated as the user drags, providing the total displacement
   * from the starting point of the gesture.
   */
  const bindGestures = useGesture(
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
          // The first direction determines the "scroll" direction
          const [direction] = state.direction;
          scroll(direction < 0 ? 50 : -50);
        }
      },
      onWheel: (state) => {
        scroll(state.event.deltaY);
      }
    },
    {
      // To make it differentiate better between dragging and pinching
      drag: { threshold: 0.1 },
      eventOptions: { passive: false }
    }
  );

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

  return { bindGestures, isDragging };
}
