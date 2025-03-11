export interface TaskbarItemConfig {
  id: string;
  visible: boolean; // Whether the menu item should be visible in the taskbar.
  enabled: boolean; // Whether the menu item is enabled, for example the missions panel
  // is enabled = false when a mission is not loaded or if a specific module is disabled
}
