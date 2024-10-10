import OpenSpaceApi from 'openspace-api-js';
import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
  PropsWithChildren
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OpenSpaceContext = createContext<any | null>(null);

interface Props {
  hej: string;
}

export function OpenSpaceProvider({ children, hej }: PropsWithChildren<Props>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [openspace, setOpenSpace] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiRef, setApiRef] = useState<any | null>(null);
  /*   function connectOpenSpace() {
    if (isConnected) {
      return;
    }
    apiRef?.connect();
  }

  function disconnectOpenSpace() {
    if (!isConnected) {
      return;
    }
    apiRef?.disconnect();
  } */
  useEffect(() => {
    const api = OpenSpaceApi(
      import.meta.env.VITE_OPENSPACE_ADDRESS,
      import.meta.env.VITE_OPENSPACE_PORT
    );

    api.onConnect(async () => {
      const os = await api.singleReturnLibrary();
      setOpenSpace(os);
      setIsConnected(true);
    });

    api.onDisconnect(async () => {
      setIsConnected(false);
      setOpenSpace(null);
    });

    setTimeout(() => {
      api.connect();
      setApiRef(api);
    }, 2000);
  }, []);

  return (
    <OpenSpaceContext.Provider value={openspace}>{children}</OpenSpaceContext.Provider>
  );
}

export function useOpenSpaceApi() {
  const context = useContext(OpenSpaceContext);
  if (!context) {
    throw new Error('useOpenSpaceApi must be used within a OpenSpaceProviders');
  }
  return context;
}
