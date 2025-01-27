import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetStringPropertyValue } from '@/api/hooks';

import { Messages } from './types';

export function useSendMessageToWwt() {
  const [wwtHasLoaded, setWwtHasLoaded] = useState(false);
  const [url] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');

  const [imageCollectionLoaded, setImageCollectionLoaded] = useState(false);
  const setSetupWwtFunc = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Add event listeners for World Wide Telescope responses
  useEffect(() => {
    function handleCallbackMessage(event) {
      // We got the first response from wwt - now load the image collection
      // and hide the settings icons on the side
      if (event.data === 'wwt_has_loaded') {
        setWwtHasLoaded(true);
        hideChrome();
        if (url) {
          loadImageCollection(url);
        }
      }
      // Image collection finished loading
      if (event.data === 'load_image_collection_completed') {
        setImageCollectionLoaded(true);
        console.log('Image collecvtion is loaded');
      }
    }

    window.addEventListener('message', handleCallbackMessage);
    return () => window.removeEventListener('message', handleCallbackMessage);
  }, [hideChrome, loadImageCollection, url]);

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

  // Start send messages to World Wide Telescope to trigger a response
  useEffect(() => {
    if (!wwtHasLoaded && url !== undefined) {
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
  }, [url, wwtHasLoaded, setAim]);

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

  return {
    ref,
    setAim,
    setBorderColor,
    setBorderRadius,
    imageCollectionLoaded,
    wwtHasLoaded
  };
}
