import { useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch } from '@/redux/hooks';
import {
  subscribeToSkyBrowser,
  unsubscribeToSkyBrowser
} from '@/redux/skybrowser/skybrowserMiddleware';
import { setImageCollectionData } from '@/redux/skybrowser/skybrowserSlice';
import { useEffect } from 'react';

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
          console.log(imgDataWithKey);
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
