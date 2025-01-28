import { PropsWithChildren, useEffect } from 'react';

import { WwtContext } from './WwtContext';
import { useMessages, startPingingWwt, useWwtEventListener } from './hooks';
import { useGetStringPropertyValue } from '@/api/hooks';

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
  const { imageCollectionLoaded, wwtHasLoaded } = useWwtEventListener();

  // Start pinging WWT with the set aim function
  // We want to make sure we have the image collection url so wait for that
  const [url] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const connect = !wwtHasLoaded && url !== undefined;
  startPingingWwt(connect, setAim);

  // Once wwt has been loaded, we pass messages to hide chrome and load the image
  // collection
  useEffect(() => {
    if (wwtHasLoaded && url !== undefined) {
      hideChrome();
      loadImageCollection(url);
    }
  }, [wwtHasLoaded]);

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
