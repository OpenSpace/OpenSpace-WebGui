import { TreeNodeData } from '@mantine/core';

export interface SceneTreeNodeData extends TreeNodeData {
  guiPath?: string[];
}

export interface SceneTreeFilterSettings {
  showOnlyVisible: boolean;
  showHiddenNodes: boolean;
  tags: string[];
}
