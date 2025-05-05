import { TaskbarItemConfig } from '@/panels/Menu/types';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

export function createDefaultTaskbar(): TaskbarItemConfig[] {
  return Object.values(menuItemsData).map((item) => ({
    id: item.componentID,
    visible: item.defaultVisible,
    name: item.title,
    isOpen: false
  }));
}
