export interface MenuItemConfig {
  id: string;
  // The name of the menu item. This will show up in the OpenSpace launcher.
  name: string;
  // Whether the menu item should be visible in the toolbar.
  visible: boolean;
  // Whether a menu item (panel) is open or closed
  isOpen: boolean;
}
