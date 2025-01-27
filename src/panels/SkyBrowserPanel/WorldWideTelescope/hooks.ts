import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetStringPropertyValue } from '@/api/hooks';

import { Messages } from './types';

// This hook defines the messages WWT can receive and provides the ref
// that should be attached to the iframe of WWT
function useMessages() {
  const ref = useRef<HTMLIFrameElement>(null);

  const sendMessageToWwt = useCallback((message: Messages) => {
    try {
      const frame = ref.current?.contentWindow;
      if (frame && message) {
        frame.postMessage(message, '*');
      }
    } catch (e) {
      // Do nothing
      console.error(e);
    }
  }, []);

  const setBorderRadius = useCallback(
    (radius: number) => {
      sendMessageToWwt({
        event: 'set_border_radius',
        data: radius
      });
    },
    [sendMessageToWwt]
  );

  const setBorderColor = useCallback(
    (color: number[]) => {
      sendMessageToWwt({
        event: 'set_background_color',
        data: color
      });
    },
    [sendMessageToWwt]
  );

  const hideChrome = useCallback(() => {
    sendMessageToWwt({
      event: 'modify_settings',
      settings: [['hideAllChrome', true]],
      target: 'app'
    });
  }, [sendMessageToWwt]);

  const loadImageCollection = useCallback(
    (url: string) => {
      sendMessageToWwt({
        event: 'load_image_collection',
        url: url,
        loadChildFolders: true
      });
    },
    [sendMessageToWwt]
  );

  const setAim = useCallback(
    (ra: number, dec: number, fov: number, roll: number) => {
      sendMessageToWwt({
        event: 'center_on_coordinates',
        ra,
        dec,
        fov,
        roll,
        instant: true
      });
    },
    [sendMessageToWwt]
  );

  return {
    ref,
    setBorderColor,
    setBorderRadius,
    hideChrome,
    loadImageCollection,
    setAim
  };
}

// This hook will set up message listeners so we can collect the messages wwt sends
// Once wwt has loaded, we load the image collection
function useWwtEventListener() {
  const [wwtHasLoaded, setWwtHasLoaded] = useState(false);
  const [imageCollectionLoaded, setImageCollectionLoaded] = useState(false);

  // Add event listeners for World Wide Telescope responses
  useEffect(() => {
    function handleCallbackMessage(event: MessageEvent) {
      // We got the first response from wwt - now load the image collection
      // and hide the settings icons on the side
      if (event.data === 'wwt_has_loaded') {
        setWwtHasLoaded(true);
      }
      // Image collection finished loading
      if (event.data === 'load_image_collection_completed') {
        setImageCollectionLoaded(true);
      }
    }

    window.addEventListener('message', handleCallbackMessage);
    return () => window.removeEventListener('message', handleCallbackMessage);
  }, []);

  return { wwtHasLoaded, imageCollectionLoaded };
}

// This hook will start sending messages to WorldWideTelescope to trigger a response
// Once a response has been given we cancel the pinging
function useStartConnection(
  connect: boolean,
  setAim: (ra: number, dec: number, fov: number, roll: number) => void
) {
  const setSetupWwtFunc = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start send messages to World Wide Telescope to trigger a response
  useEffect(() => {
    if (connect) {
      // Send aim messages to WorldWide Telescope to prompt it to reply with a message
      setSetupWwtFunc.current = setInterval(setAim, 250);
    }
    // When WorldWide Telescope has replied with a message, stop sending it unnecessary messages
    return () => {
      if (!setSetupWwtFunc.current) {
        return;
      }
      clearInterval(setSetupWwtFunc.current);
      setSetupWwtFunc.current = null;
    };
  }, [connect, setAim]);
}

export function useSendMessageToWwt() {
  const {
    ref,
    setAim,
    setBorderColor,
    setBorderRadius,
    hideChrome,
    loadImageCollection
  } = useMessages();
  // Set up the message listener which will tell us once wwt has been loaded
  // and when the image collection has been loaded
  const { imageCollectionLoaded, wwtHasLoaded } = useWwtEventListener();

  // Start pinging WWT with the set aim function
  // We want to make sure we have the image collection url so wait for that
  const [url] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const connect = !wwtHasLoaded && url !== undefined;
  useStartConnection(connect, setAim);

  // Once wwt has been loaded, we pass messages to hide chrome and load the image
  // collection
  useEffect(() => {
    if (wwtHasLoaded && url !== undefined) {
      hideChrome();
      loadImageCollection(url);
    }
  }, [wwtHasLoaded]);

  return {
    ref,
    setAim,
    setBorderColor,
    setBorderRadius,
    imageCollectionLoaded,
    wwtHasLoaded
  };
}
