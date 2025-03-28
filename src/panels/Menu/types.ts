export interface TaskbarItemConfig {
  id: string;
  // The name of the menu item. This will show up in the OpenSpace launcher.
  name: string;
  // Whether the menu item should be visible in the taskbar.
  visible: boolean;
  // Whether the menu item is enabled, for example the missions panel.
  // @TODO anden88 2025-03-12: determine if we will be using the enabled property to
  // to disable using a certain menu, e.g., disable Sky browser in a dome. Leaving the
  // the variable since we can otherwise repurpose it for whether a panel is open/closed
  enabled: boolean;
  // when a mission is not loaded or if a specific module is disabled
  // is enabled = false
}
