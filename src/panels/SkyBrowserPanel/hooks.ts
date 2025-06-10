import { useEffect, useTransition } from 'react';
import { useTranslation } from 'react-i18next';

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
import {
  customPrecisionEqualFunc,
  equalArray,
  lowPrecisionEqual,
  lowPrecisionEqualArray,
  lowPrecisionEqualMatrix
} from '@/util/equals';

import { SkyBrowserImage } from './types';

export function useWwtImageCollection(): [boolean, SkyBrowserImage[] | undefined] {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'wwt.error' });

  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getWwtListOfImages() {
      if (!luaApi || !luaApi.skybrowser) {
        return;
      }
      const imgData = await luaApi.skybrowser.listOfImages();
      if (!imgData) {
        throw new Error(t('unable-to-load-wwt'));
      }
      const images = Object.values(imgData) as SkyBrowserImage[];
      if (images.length === 0) {
        throw new Error(t('no-images'));
      }

      // Success - we got the images. Adding to redux
      dispatch(setImageCollectionData(images));
    }

    try {
      // We only need to get the images if we don't have them already
      if (imageList === undefined) {
        startTransition(() => {
          getWwtListOfImages();
        });
      }
    } catch (error) {
      throw Error(t('unable-to-load-images', { error }));
    }
  }, [luaApi, dispatch, imageList, t]);

  const isLoading = isPending || imageList === undefined;

  return [isLoading, imageList];
}

export function useSkyBrowserData() {
  const dispatch = useAppDispatch();
  const connected = useAppSelector((state) => state.connection.connectionStatus);
  useEffect(() => {
    dispatch(subscribeToSkyBrowser());
    return () => {
      dispatch(unsubscribeToSkyBrowser());
    };
    // We want to run this effect when the connection status changes
  }, [dispatch, connected]);
}

export function useActiveImage(): [string, (url: string) => void] {
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);

  const dispatch = useAppDispatch();

  function setImage(url: string) {
    dispatch(setActiveImage(url));
  }
  return [activeImage, setImage];
}

// Below are hooks to get the values from the skybrowser topic. They
// are setup so the value from the selector only should update when
// the value itself actually updates. TODO (ylvse 2025-01-29): rewrite
// the topic so that most of the data are properties instead, and only
// pass the data for the currently selected browser

export function useBrowserColor(id: string): [number, number, number] | undefined {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.color,
    lowPrecisionEqualArray
  );
}

export function useBrowserColorString(id: string): string | undefined {
  const color = useBrowserColor(id);
  return color ? (`rgb(${color.join(',')})` as string) : undefined;
}

export function useBrowserRadius(id: string): number {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.borderRadius,
    lowPrecisionEqual
  );
}

export function useBrowserCoords(id: string) {
  const ra = useAppSelector(
    (state) => state.skybrowser.browsers[id]?.ra,
    customPrecisionEqualFunc(1e-8)
  );
  const dec = useAppSelector(
    (state) => state.skybrowser.browsers[id]?.dec,
    customPrecisionEqualFunc(1e-8)
  );

  const roll = useAppSelector(
    (state) => state.skybrowser.browsers[id]?.roll,
    customPrecisionEqualFunc(1e-6)
  );
  return { ra, dec, roll };
}

export function useBrowserFov(id: string) {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.fov,
    customPrecisionEqualFunc(1e-6)
  );
}

export function useCartesianDirection(id: string) {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.cartesianDirection,
    lowPrecisionEqualArray
  );
}

export function useSelectedImages(id: string) {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.selectedImages,
    equalArray<number>
  );
}

export function useOpacities(id: string) {
  return useAppSelector(
    (state) => state.skybrowser.browsers[id]?.opacities,
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
