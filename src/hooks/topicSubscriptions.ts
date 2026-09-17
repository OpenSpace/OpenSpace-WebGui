import { useEffect } from 'react';

import {
  subscribeToAssetTree,
  unsubscribeToAssetTree
} from '@/redux/assettree/assetTreeMiddleware';
import { subscribeToCamera, unsubscribeToCamera } from '@/redux/camera/cameraMiddleware';
import {
  subscribeToCameraPath,
  unsubscribeToCameraPath
} from '@/redux/camerapath/cameraPathMiddleware';
import {
  subscribeToEngineMode,
  unsubscribeToEngineMode
} from '@/redux/enginemode/engineModeMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSessionRecording,
  unsubscribeToSessionRecording
} from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';

export function useSubscribeToCamera() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToCamera());
    return () => {
      dispatch(unsubscribeToCamera());
    };
  }, [dispatch]);
}

export function useSubscribeToAssetTree() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToAssetTree());
    return () => {
      dispatch(unsubscribeToAssetTree());
    };
  }, [dispatch]);
}

export const useSubscribeToTime = () => {
  const now = useAppSelector((state) => state.time.timeCapped);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToTime());
    return () => {
      dispatch(unsubscribeToTime());
    };
  }, [dispatch]);
  return now;
};

export function useSubscribeToEngineMode() {
  const engineMode = useAppSelector((state) => state.engineMode.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToEngineMode());
    return () => {
      dispatch(unsubscribeToEngineMode());
    };
  }, [dispatch]);
  return engineMode;
}

export function useSubscribeToCameraPath() {
  const cameraPath = useAppSelector((state) => state.cameraPath);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToCameraPath());
    return () => {
      dispatch(unsubscribeToCameraPath());
    };
  }, [dispatch]);

  return cameraPath;
}

export function useSubscribeToSessionRecording() {
  const recordingState = useAppSelector((state) => state.sessionRecording.state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToSessionRecording());
    return () => {
      dispatch(unsubscribeToSessionRecording());
    };
  }, [dispatch]);

  return recordingState;
}
