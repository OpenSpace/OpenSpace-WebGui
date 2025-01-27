import { useEffect } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSkyBrowser,
  unsubscribeToSkyBrowser
} from '@/redux/skybrowser/skybrowserMiddleware';
import {
  setActiveImage,
  setImageCollectionData,
  SkyBrowserBrowser
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

export function useSelectedBrowserColor(): number[] | undefined {
  const color = useAppSelector(
    (state) => state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.color,
    lowPrecisionEqualArray
  );
  return color;
}

export function useSelectedBrowserColorString(): string | undefined {
  const color = useSelectedBrowserColor();
  return color ? (`rgb(${color.join(',')})` as string) : undefined;
}

export function useSelectedBrowserProperty<T extends keyof SkyBrowserBrowser>(
  property: T
): SkyBrowserBrowser[T] | undefined {
  const result = useAppSelector(
    (state) =>
      state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.[property] ??
      undefined
  );
  return result;
}

function lowPrecisionEqualArray(lhs: number[] | undefined, rhs: number[] | undefined) {
  if (lhs === rhs) {
    return true;
  }
  if (!lhs || !rhs) {
    return false;
  }
  return lhs?.every((value, i) => lowPrecisionEqual(value, rhs[i]));
}

function lowPrecisionEqual(lhs: number | undefined, rhs: number | undefined) {
  return lhs?.toFixed(2) === rhs?.toFixed(2);
}

export function useSelectedBrowserCoords() {
  const ra = useAppSelector(
    (state) =>
      state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.['ra'] ??
      undefined,
    lowPrecisionEqual
  );
  const dec = useAppSelector(
    (state) =>
      state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.['dec'] ??
      undefined,
    lowPrecisionEqual
  );
  const fov = useAppSelector(
    (state) =>
      state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.['fov'] ??
      undefined,
    lowPrecisionEqual
  );
  const roll = useAppSelector(
    (state) =>
      state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId]?.['roll'] ??
      undefined,
    lowPrecisionEqual
  );
  return { ra, dec, fov, roll };
}
