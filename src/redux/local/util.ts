import { TaskbarItemConfig } from '@/panels/Menu/types';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

export function createDefaultTaskbar(): TaskbarItemConfig[] {
  return Object.values(menuItemsData).map((item) => {
    return {
      id: item.componentID,
      visible: item.defaultVisible,
      enabled: true,
      name: item.title,
      isOpen: false
    };
  });
}
