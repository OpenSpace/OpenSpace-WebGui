import { CloseButton } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SceneGraphNodeView } from './SceneGraphNode/SceneGraphNodeView';
import { Scene } from './Scene';

export function ScenePanel() {
  const { height } = useWindowSize();
  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode
  );

  const dispatch = useAppDispatch();

  if (currentlySelectedNode) {
    return (
      <Layout>
        <Layout.FixedSection>
          <ResizeableContent defaultHeight={height * 0.5}>
            <Scene />
          </ResizeableContent>
        </Layout.FixedSection>
        <Layout.GrowingSection>
          <SceneGraphNodeView
            uri={currentlySelectedNode}
            extraTopControls={
              <CloseButton
                flex={0}
                onClick={() => dispatch(setSceneTreeSelectedNode(null))}
              />
            }
            showOpenInNewWindow
          />
        </Layout.GrowingSection>
      </Layout>
    );
  }
  return <Scene />;
}
