import { useAppDispatch } from '@/redux/hooks';
import {
  subscribeToSkyBrowser,
  unsubscribeToSkyBrowser
} from '@/redux/skybrowser/skybrowserMiddleware';
import { useEffect } from 'react';

export function SkyBrowserPanel() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToSkyBrowser());
    return () => {
      dispatch(unsubscribeToSkyBrowser());
    };
  }, [dispatch]);
  return <>SkyBrowser</>;
}
