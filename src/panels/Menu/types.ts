export interface TaskbarItemConfig {
  id: string;
  // Whether the menu item should be visible in the taskbar.
  // @TODO anden88 2025-03-12: determine if we will be using the enabled property to
  // to disable using a certain menu, e.g., disable Sky browser in a dome.
  visible: boolean;
  // Whether the menu item is enabled, for example the missions panel has enabled = false
  // when a mission is not loaded or if a specific module is disabled
  enabled: boolean;
  // Whether a menu item (panel) is open or closed
  isOpen: boolean;
}
