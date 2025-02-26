import { useEffect, useState } from 'react';
import { Box, Overlay, Transition } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';

import { SceneGraphNodeView } from '../SceneGraphNode/SceneGraphNodeView';

export function CurrentNodeView() {
  const [isMounted, setIsMounted] = useState(false);
  const [showHighlight, setShowHiglight] = useState(true);

  const currentNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode
  );

  const dispatch = useAppDispatch();

  // Show visual highlight when the current node changes
  useEffect(() => {
    setShowHiglight(true);
    const timeoutId = setTimeout(() => {
      setShowHiglight(false);
    }, 700);

    return () => {
      clearTimeout(timeoutId);
      setShowHiglight(false);
    };
  }, [currentNode]);

  // Reset selected node when the component unmounts
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (isMounted) {
        dispatch(setSceneTreeSelectedNode(null));
      }
    };
  }, [dispatch, isMounted]);

  return (
    currentNode && (
      <>
        <SceneGraphNodeView uri={currentNode} />
        <Transition transition={'fade'} duration={200} mounted={showHighlight}>
          {(transitionStyle) => (
            <Box style={transitionStyle}>
              <Overlay
                color={'var(--mantine-primary-color-filled)'}
                radius={'md'}
                opacity={0.5}
                h={50}
              />
            </Box>
          )}
        </Transition>
      </>
    )
  );
}
