import { Tree } from '@mantine/core';
import { SceneTreeNode } from '../SceneTree/SceneTreeNode';
import { useAppSelector } from '@/redux/hooks';
import { treeDataForPropertyOwner } from '@/redux/groups/groupsSlice';

interface Props {
  uri: string;
}

export function PropertyOwner({ uri }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Generate the tree data in Redux?
  const treeData = [treeDataForPropertyOwner(uri, propertyOwners)];

  return (
    <Tree
      data={treeData}
      renderNode={(payload) => <SceneTreeNode {...payload} />}
    />
  );
}

