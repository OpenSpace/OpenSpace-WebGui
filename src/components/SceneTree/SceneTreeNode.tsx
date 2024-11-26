import { Paper, RenderTreeNodePayload } from '@mantine/core';

import { CollapsableHeader } from '../CollapsableHeader/CollapsableHeader';

import { isGroup } from './treeUtil';

interface GroupHeaderProps {
  expanded: boolean;
  label: React.ReactNode;
}

export function GroupHeader({ expanded, label }: GroupHeaderProps) {
  return <CollapsableHeader expanded={expanded} text={label} />;
}

interface PropertyOwnerHeaderProps {
  label: React.ReactNode;
}

export function PropertyOwnerHeader({ label }: PropertyOwnerHeaderProps) {
  // TODO: Implement how this should look like. Sould be clear that it's clickable
  return (
    <Paper p={'1px'}>{label}</Paper>
  );
}

export function SceneTreeNode({ node, expanded, elementProps }: RenderTreeNodePayload) {
  return <div {...elementProps}>
    {isGroup(node) ?
      <GroupHeader expanded={expanded} label={node.label} /> :
      <PropertyOwnerHeader label={node.label} />
    }
  </div>;
}
