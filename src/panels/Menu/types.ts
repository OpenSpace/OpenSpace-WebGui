export interface TaskbarItemConfig {
  id: string;
  // The name of the menu item. This will show up in the OpenSpace launcher.
  name: string;
  // Whether the menu item should be visible in the taskbar.
  // @TODO anden88 2025-03-12: determine if we will be using the enabled property to
  // to disable using a certain menu, e.g., disable Sky browser in a dome.
  visible: boolean;
  // Whether a menu item (panel) is open or closed
  isOpen: boolean;
}
