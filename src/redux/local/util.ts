import { ToolbarItemConfig } from '@/panels/Menu/types';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

export function createDefaultToolbar(): ToolbarItemConfig[] {
  return Object.values(menuItemsData).map((item) => ({
    id: item.componentID,
    visible: item.defaultVisible,
    name: item.title,
    isOpen: false
  }));
}
