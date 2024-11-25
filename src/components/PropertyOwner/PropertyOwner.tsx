import { Tree } from '@mantine/core';
import { SceneTreeNode } from '../SceneTree/SceneTreeNode';
import { treeDataForPropertyOwner } from '../SceneTree/treeUtil';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  uri: string;
}

export function PropertyOwner({ uri }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const treeData = [treeDataForPropertyOwner(uri, propertyOwners)];

  return (
    <Tree
      data={treeData}
      renderNode={(payload) => <SceneTreeNode {...payload} />}
    />
  );
}

