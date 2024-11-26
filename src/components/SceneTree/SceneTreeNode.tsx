import { Paper, RenderTreeNodePayload } from '@mantine/core';

import { CollapsableHeader } from '../CollapsableHeader/CollapsableHeader';
import { Property } from '../Property/Property';

import { isGroup, isPropertyOwner } from './treeUtil';

interface HeaderProps {
  expanded: boolean;
  label: React.ReactNode;
}

export function GroupHeader({ expanded, label }: HeaderProps) {
  return <CollapsableHeader expanded={expanded} text={label} />;
}

export function PropertyOwnerHeader({ expanded, label }: HeaderProps) {
  return (
    <Paper p={'1px'}>
      <CollapsableHeader expanded={expanded} text={label} />
    </Paper>
  );
}

export function SceneTreeNode({ node, expanded, elementProps }: RenderTreeNodePayload) {
  let content;
  if (isGroup(node)) {
    content = <GroupHeader expanded={expanded} label={node.label} />;
  } else if (isPropertyOwner(node)) {
    content = <PropertyOwnerHeader expanded={expanded} label={node.label} />;
  } else {
    content = <Property uri={node.value} />;
  }

  return <div {...elementProps}>{content}</div>;
}
