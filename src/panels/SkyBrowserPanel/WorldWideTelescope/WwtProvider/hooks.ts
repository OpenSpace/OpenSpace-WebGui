import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Messages } from './types';
import { WwtContext } from './WwtContext';

// This file contains the hooks necessary to set up the communication with
// World Wide Telescope and pass it messages

// This hook defines the messages WWT can receive and provides the ref
// that should be attached to the iframe of WWT
export function useMessages() {
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

  const loadImage = useCallback(
    (url: string) => {
      sendMessageToWwt({
        event: 'image_layer_create',
        id: url,
        url: url,
        mode: 'preloaded',
        goto: false
      });
    },
    [sendMessageToWwt]
  );

  const setOpacity = useCallback(
    (url: string, opacity: number) => {
      sendMessageToWwt({
        event: 'image_layer_set',
        id: url,
        setting: 'opacity',
        value: opacity
      });
    },
    [sendMessageToWwt]
  );

  const removeImage = useCallback(
    (id: string) => {
      sendMessageToWwt({
        event: 'image_layer_remove',
        id: id
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
    setAim,
    loadImage,
    setOpacity,
    removeImage
  };
}

// This hook will set up message listeners so we can collect the messages wwt sends
// It keeps tabs of two states: when the application has loaded and when the image
// collection has finished loading
export function useWwtEventListener() {
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

  return {
    wwtHasLoaded,
    imageCollectionLoaded,
    setWwtHasLoaded,
    setImageCollectionLoaded
  };
}

// This hook will start sending messages to WorldWideTelescope to trigger a response
// Once a response has been given we cancel the pinging
export function useStartPingingWwt(
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

// This is the context that will set up all needed connection and expose the
// functions, states, and ref to the children
export function useWwtProvider() {
  const context = useContext(WwtContext);
  if (!context) {
    throw Error('useWwtProvider must be used within a WwtProvider');
  }
  return context;
}
