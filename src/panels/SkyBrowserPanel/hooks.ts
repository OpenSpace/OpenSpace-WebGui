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
import { SkyBrowserImage } from '@/types/skybrowsertypes';

export function useGetWwtImageCollection() {
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getWwtListOfImages() {
      if (!luaApi || !luaApi.skybrowser) {
        return;
      }
      const imgData = await luaApi.skybrowser.listOfImages();
      if (!imgData) {
        throw new Error(`Couldn't load AAS WorldWide Telescope images!`);
      }
      const images = Object.values(imgData) as SkyBrowserImage[];
      if (images.length === 0) {
        throw new Error('Received 0 AAS WorldWide Telescope images!');
      }

      // Success - we got the images. Adding to redux
      dispatch(setImageCollectionData(images));
    }

    try {
      getWwtListOfImages();
    } catch (e) {
      throw Error(`Could not load image collection from OpenSpace. Error: ${e}`);
    }
  }, [luaApi, dispatch]);
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

export function useSelectedBrowserColor(): [number, number, number] | undefined {
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.color,
    lowPrecisionEqualArray
  );
}

export function useSelectedBrowserColorString(): string | undefined {
  const color = useSelectedBrowserColor();
  return color ? (`rgb(${color.join(',')})` as string) : undefined;
}

export function useSelectedBrowserRadius(): number | undefined {
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.borderRadius,
    lowPrecisionEqual()
  );
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
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.fov,
    lowPrecisionEqual(1e-6)
  );
}

export function useSkyBrowserCartesianDirection() {
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.cartesianDirection,
    lowPrecisionEqualArray
  );
}

export function useSkyBrowserColors() {
  return useAppSelector(
    (state) => state.skybrowser.browserColors,
    lowPrecisionEqualMatrix
  );
}

export function useSkyBrowserNames() {
  return useAppSelector((state) => state.skybrowser.browserNames, equalArray<string>);
}

export function useSkyBrowserIds() {
  return useAppSelector((state) => state.skybrowser.browserIds, equalArray<string>);
}

export function useSkyBrowserSelectedImages() {
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.selectedImages,
    equalArray<number>
  );
}

export function useSkyBrowserSelectedOpacities() {
  return useAppSelector(
    (state) => state.skybrowser.selectedBrowser?.opacities,
    lowPrecisionEqualArray
  );
}
