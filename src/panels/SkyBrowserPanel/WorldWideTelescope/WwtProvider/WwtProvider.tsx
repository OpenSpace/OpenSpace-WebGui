import { PropsWithChildren, useEffect } from 'react';

import { useGetStringPropertyValue } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { useMessages, useStartPingingWwt, useWwtEventListener } from './hooks';
import { WwtContext } from './WwtContext';

export function WwtProvider({ children }: PropsWithChildren) {
  const {
    ref,
    setAim,
    setBorderColor,
    setBorderRadius,
    hideChrome,
    loadImageCollection,
    loadImage,
    setOpacity,
    removeImage
  } = useMessages();
  // Set up the message listener which will tell us once wwt has been loaded
  // and when the image collection has been loaded
  const {
    imageCollectionLoaded,
    wwtHasLoaded,
    setWwtHasLoaded,
    setImageCollectionLoaded
  } = useWwtEventListener();

  const noOfBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);

  const [url] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const connect = !wwtHasLoaded && url !== undefined && noOfBrowsers === 0;
  // Start pinging WWT with the set aim function
  // We want to make sure we have the image collection url so wait for that
  useStartPingingWwt(connect, setAim);
  // Once wwt has been loaded, we pass messages to hide chrome and load the image
  // collection
  useEffect(() => {
    if (wwtHasLoaded && url !== undefined) {
      hideChrome();
      loadImageCollection(url);
    }
  }, [wwtHasLoaded, hideChrome, loadImageCollection, url]);

  // If we have no browsers we want to reset the flags for next time
  useEffect(() => {
    if (noOfBrowsers === 0) {
      setWwtHasLoaded(false);
      setImageCollectionLoaded(false);
    }
  }, [noOfBrowsers, setWwtHasLoaded, setImageCollectionLoaded]);

  return (
    <WwtContext.Provider
      value={{
        ref,
        setAim,
        setBorderColor,
        setBorderRadius,
        loadImage,
        setOpacity,
        imageCollectionLoaded,
        wwtHasLoaded,
        removeImage
      }}
    >
      {children}
    </WwtContext.Provider>
  );
}
