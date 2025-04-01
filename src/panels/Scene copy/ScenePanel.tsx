import { CloseButton } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode2 } from '@/redux/local/localSlice';

import { SceneGraphNodeView } from './SceneGraphNode/SceneGraphNodeView';
import { Scene } from './Scene';

export function ScenePanel() {
  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode2
  );

  const dispatch = useAppDispatch();

  if (currentlySelectedNode) {
    return (
      <Layout>
        <Layout.FixedSection>
          <ResizeableContent defaultHeight={(window.innerHeight - 100) * 0.5}>
            <Scene />
          </ResizeableContent>
        </Layout.FixedSection>
        <Layout.GrowingSection>
          <SceneGraphNodeView
            uri={currentlySelectedNode}
            extraTopControls={
              <CloseButton
                flex={0}
                onClick={() => dispatch(setSceneTreeSelectedNode2(null))}
              />
            }
          />
        </Layout.GrowingSection>
      </Layout>
    );
  }
  return <Scene />;
}
