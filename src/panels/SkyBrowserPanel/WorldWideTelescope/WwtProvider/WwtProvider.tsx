import { PropsWithChildren, useEffect } from 'react';

import { useProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';

import { useStartPingingWwt, useWwtEventListener, useWwtMessages } from './hooks';
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
  } = useWwtMessages();
  // Set up the message listener which will tell us once wwt has been loaded
  // and when the image collection has been loaded
  const {
    imageCollectionLoaded,
    wwtHasLoaded,
    setWwtHasLoaded,
    setImageCollectionLoaded
  } = useWwtEventListener();

  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const [url] = useProperty('StringProperty', 'Modules.SkyBrowser.WwtImageCollectionUrl');
  const shouldConnect = !wwtHasLoaded && url !== undefined && nBrowsers > 0;
  const id = useAppSelector((state) => state.skybrowser.selectedBrowserId);

  useEffect(() => {
    return () => {
      setWwtHasLoaded(false);
      setImageCollectionLoaded(false);
    };
  }, [setImageCollectionLoaded, setWwtHasLoaded]);
  // Start pinging WWT with the set aim function
  // We want to make sure we have the image collection url so wait for that
  useStartPingingWwt(shouldConnect, setAim);
  // Once wwt has been loaded, we pass messages to hide the built in default interface
  // with the "hide chrome" message and load the image collection
  useEffect(() => {
    if (wwtHasLoaded && url !== undefined) {
      hideChrome();
      loadImageCollection(url);
    }
  }, [wwtHasLoaded, hideChrome, loadImageCollection, url]);

  // If we have no browsers we want to reset the flags for next time
  // If the browser gets deselected we need to reset the WWT window
  useEffect(() => {
    if (nBrowsers === 0 || id == '') {
      setWwtHasLoaded(false);
      setImageCollectionLoaded(false);
    }
  }, [nBrowsers, id, setWwtHasLoaded, setImageCollectionLoaded]);

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
