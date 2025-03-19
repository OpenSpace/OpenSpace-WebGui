import { Layout } from '@/components/Layout/Layout';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useAppSelector } from '@/redux/hooks';

import { SceneGraphNodeView } from './SceneGraphNode/SceneGraphNodeView';
import { Scene } from './Scene';

export function ScenePanel() {
  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode
  );

  if (currentlySelectedNode) {
    return (
      <Layout>
        <Layout.FixedSection>
          <ResizeableContent defaultHeight={300}>
            <Scene />
          </ResizeableContent>
        </Layout.FixedSection>
        <Layout.GrowingSection>
          <SceneGraphNodeView uri={currentlySelectedNode} />
        </Layout.GrowingSection>
      </Layout>
    );
  }
  return <Scene />;
}
