export interface SceneGraphNodesFilters {
  // If true, include nodes marked as hidden in the GUI
  showHiddenNodes?: boolean;
  // If true, only show nodes marked as focusable
  onlyFocusable?: boolean;
  // A list of tags to filter by
  tags?: string[];
}
