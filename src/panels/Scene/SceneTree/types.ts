import { TreeNodeData } from '@mantine/core';

import { SceneGraphNodesFilters } from '@/hooks/sceneGraphNodes/types';

export interface SceneTreeNodeData extends TreeNodeData {
  guiPath?: string[];
}

export interface SceneTreeFilterSettings extends SceneGraphNodesFilters {
  // In addition to the filters based on GUI setting and tags, this filter will only
  // show nodes that are currently visible in the scene (i.e. enabled and not faded out)
  showOnlyVisible: boolean;
}

export const sceneTreeFilterDefaults: SceneTreeFilterSettings = {
  showOnlyVisible: false,
  includeGuiHiddenNodes: false,
  onlyFocusable: false,
  tags: []
};
