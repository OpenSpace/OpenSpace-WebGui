export interface SceneGraphNodesFilters {
  // If true, include nodes marked as hidden in the GUI
  includeGuiHiddenNodes?: boolean;
  // If true, only show nodes marked as focusable
  onlyFocusable?: boolean;
  // A list of tags to filter by
  tags?: string[];
  // If true, only show nodes that are currently visible
  onlyVisible?: boolean;
}
