import { useEffect } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSkyBrowser,
  unsubscribeToSkyBrowser
} from '@/redux/skybrowser/skybrowserMiddleware';
import {
  setActiveImage,
  setImageCollectionData
} from '@/redux/skybrowser/skybrowserSlice';

export function useGetWwtImageCollection() {
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function getWwtListOfImages() {
      if (!luaApi || !luaApi.skybrowser) {
        return;
      }
      const imgData = await luaApi.skybrowser.listOfImages();
      if (imgData) {
        const images = Object.values(imgData);
        if (images.length !== 0) {
          const imgDataWithKey = images.map((image) => ({
            ...image,
            key: image.identifier
          }));
          dispatch(setImageCollectionData(imgDataWithKey));
        }
      } else {
        throw new Error('No AAS WorldWide Telescope images!');
      }
    }
    try {
      getWwtListOfImages();
    } catch (e) {
      console.error(e);
    }
  }, [luaApi]);
}

export function useGetSkyBrowserData() {
  useGetWwtImageCollection();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToSkyBrowser());
    return () => {
      dispatch(unsubscribeToSkyBrowser());
    };
  }, [dispatch]);
}

export function useActiveImage(): [string, (url: string) => void] {
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);

  const dispatch = useAppDispatch();

  function setImage(url: string) {
    dispatch(setActiveImage(url));
  }
  return [activeImage, setImage];
}

// Below are hooks to get the values from the sky browser topic. They
// are setup so the value from the selector only should update when
// the value itself actually updates. TODO (ylvse 2025-01-29): rewrite
// the topic so that most of the data are properties instead, and only
// pass the data for the currently selected browser

export function useSelectedBrowserColor(): number[] | undefined {
  const color = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.color,
    lowPrecisionEqualArray
  );
  return color;
}

export function useSelectedBrowserColorString(): string | undefined {
  const color = useSelectedBrowserColor();
  return color ? (`rgb(${color.join(',')})` as string) : undefined;
}

export function useSelectedBrowserRadius(): number | undefined {
  const radius = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.borderRadius,
    lowPrecisionEqual()
  );
  return radius;
}

export function lowPrecisionEqualMatrix(
  lhs: number[][] | undefined,
  rhs: number[][] | undefined
) {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }
  return lhs.every((value, i) => lowPrecisionEqualArray(value, rhs[i]));
}

export function equalArray<T>(lhs: T[] | undefined, rhs: T[] | undefined) {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }
  return lhs.every((value, i) => value === rhs[i]);
}

export function lowPrecisionEqualArray(
  lhs: number[] | undefined,
  rhs: number[] | undefined
) {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }

  return lhs?.every((value, i) => lowPrecisionEqual()(value, rhs[i]));
}

export function lowPrecisionEqual(epsilon: number = 1e-3) {
  return (lhs: number | undefined, rhs: number | undefined) => {
    if (lhs === undefined && rhs === undefined) {
      return true;
    }
    if (lhs === undefined || rhs === undefined) {
      return false;
    }
    return Math.abs(lhs - rhs) < epsilon;
  };
}

export function useSelectedBrowserCoords() {
  const ra = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.ra,
    lowPrecisionEqual(1e-6)
  );
  const dec = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.dec,
    lowPrecisionEqual(1e-6)
  );

  const roll = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.roll,
    lowPrecisionEqual(1e-6)
  );
  return { ra, dec, roll };
}

export function useSelectedBrowserFov() {
  const fov = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.fov,
    lowPrecisionEqual(1e-6)
  );

  return fov;
}

export function useSkyBrowserCartesianDirection() {
  const cartesianDirection = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.cartesianDirection,
    lowPrecisionEqualArray
  );
  return cartesianDirection;
}

export function useSkyBrowserColors() {
  const browserColors = useAppSelector(
    (state) => state.skybrowser.browserColors,
    lowPrecisionEqualMatrix
  );
  return browserColors;
}

export function useSkyBrowserNames() {
  const browserNames = useAppSelector(
    (state) => state.skybrowser.browserNames,
    equalArray<string>
  );
  return browserNames;
}

export function useSkyBrowserIds() {
  const browsersIds = useAppSelector(
    (state) => state.skybrowser.browserIds,
    equalArray<string>
  );
  return browsersIds;
}

export function useSkyBrowserSelectedImages() {
  const selectedImages = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.selectedImages,
    equalArray<number>
  );
  return selectedImages;
}

export function useSkyBrowserSelectedOpacities() {
  const opacities = useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.opacities,
    lowPrecisionEqualArray
  );
  return opacities;
}
