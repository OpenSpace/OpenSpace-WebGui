import { useTranslation } from 'react-i18next';
import { Tabs } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { KeyboardLayout } from './KeyboardLayout';
import { ListLayout } from './ListLayout';

export function KeybindsPanel() {
  const { t } = useTranslation('panel-keybinds');

  const { height: windowHeight } = useWindowSize();
  const { ref, height: tabsHeight } = useElementSize();

  // The size of the tabs list is not completely correct for some reason (likely the
  // padding in the panel), so adjust the height so there is no overflow.
  const panelHeight = windowHeight - tabsHeight - 20;

  return (
    <Tabs defaultValue={'keyboardLayout'}>
      <Tabs.List ref={ref}>
        <Tabs.Tab value={'keyboardLayout'}>{t('keyboard-view-tab-title')}</Tabs.Tab>
        <Tabs.Tab value={'listLayout'}>{t('list-view-tab-title')}</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={'keyboardLayout'} h={panelHeight}>
        <KeyboardLayout />
      </Tabs.Panel>
      <Tabs.Panel value={'listLayout'} h={panelHeight}>
        <ListLayout />
      </Tabs.Panel>
    </Tabs>
  );
}
