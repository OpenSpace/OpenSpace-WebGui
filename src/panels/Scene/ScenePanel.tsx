import { Layout } from '@/components/Layout/Layout';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SceneGraphNodeView } from './SceneGraphNode/SceneGraphNodeView';
import { Scene } from './Scene';

export function ScenePanel() {
  const { height } = useWindowSize();
  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode
  );

  if (currentlySelectedNode) {
    return (
      <Layout>
        <Layout.FixedSection>
          <ResizeableContent defaultHeight={height * 0.5}>
            <Scene />
          </ResizeableContent>
        </Layout.FixedSection>
        <Layout.GrowingSection>
          <SceneGraphNodeView uri={currentlySelectedNode} closeable />
        </Layout.GrowingSection>
      </Layout>
    );
  }
  return <Scene />;
}
