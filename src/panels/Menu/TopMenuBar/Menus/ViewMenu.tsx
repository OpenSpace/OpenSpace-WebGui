import { useTranslation } from 'react-i18next';
import {
  Button,
  CheckboxIndicator,
  Container,
  Group,
  Menu,
  Radio,
  Slider,
  Stack
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { BoolInput } from '@/components/Input/BoolInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import {
  DeleteIcon,
  NotificationsIcon,
  SaveIcon,
  SettingsIcon,
  ToolbarIcon,
  UpArrowIcon
} from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  resetToolbarItems,
  setMenuItemsOrder,
  setMenuItemVisible
} from '@/redux/local/localSlice';
import { showNotifications, updateLogLevel } from '@/redux/logging/loggingSlice';
import { IconSize, LogLevel } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems, useStoredLayout } from '../../hooks';
import { MenuDrowdownWrapper } from '../MenuDropdownWrapper';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const defaultToolbar = useAppSelector((state) => state.profile.uiPanelVisibility);
  const logNotifications = useAppSelector((state) => state.logging.showNotifications);
  const notificationLogLevel = useAppSelector((state) => state.logging.logLevel);

  const { menuItems } = useMenuItems();
  const [propertyVisibility, setPropertyVisibility, propertyVisibilityMetadata] =
    useProperty('OptionProperty', 'OpenSpaceEngine.PropertyVisibility');

  const [guiScale, setGuiScale] = useProperty(
    'FloatProperty',
    'Modules.CefWebGui.GuiScale'
  );

  const { loadLayout, saveLayout } = useStoredLayout();
  const { t } = useTranslation('menu', { keyPrefix: 'view-menu' });
  const dispatch = useAppDispatch();

  const userLevelOptions = propertyVisibilityMetadata?.additionalData.options;

  function resetToolbar() {
    dispatch(resetToolbarItems());

    // Panel visibility settings
    Object.entries(defaultToolbar).forEach(([key, value]) => {
      dispatch(setMenuItemVisible({ id: key, visible: value }));
    });
  }

  return (
    <TopBarMenuWrapper targetTitle={t('title')} closeOnItemClick={false}>
      <Menu.Sub position={'right-start'} withinPortal={false}>
        <Menu.Sub.Target>
          <Menu.Sub.Item leftSection={<ToolbarIcon />}>
            {t('task-bar.label')}
          </Menu.Sub.Item>
        </Menu.Sub.Target>

        <MenuDrowdownWrapper isSubMenu shouldLimitHeight>
          <Menu.Label pr={0}>
            <Group justify={'space-between'}>
              {t('task-bar.toggle-items')}
              <Button size={'xs'} onClick={resetToolbar}>
                {t('task-bar.reset')}
              </Button>
            </Group>
          </Menu.Label>
          <DragReorderList
            id={'viewMenu'}
            data={menuItems}
            dragHandlePosition={'right'}
            keyFunc={(item) => item.id}
            onDragEnd={({ updatedData }) => dispatch(setMenuItemsOrder(updatedData))}
            renderFunc={(itemConfig) => {
              const item = menuItemsData[itemConfig.id];
              return (
                <Menu.Item
                  key={item.componentID}
                  leftSection={
                    <Group>
                      <CheckboxIndicator
                        checked={itemConfig.visible}
                        aria-label={
                          itemConfig.visible
                            ? t('task-bar.aria-labels.checked')
                            : t('task-bar.aria-labels.unchecked')
                        }
                      />
                      {item.renderIcon?.(IconSize.xs)}
                    </Group>
                  }
                  onClick={() =>
                    dispatch(
                      setMenuItemVisible({
                        id: itemConfig.id,
                        visible: !itemConfig.visible
                      })
                    )
                  }
                >
                  {item.title}
                </Menu.Item>
              );
            }}
            gap={0}
          />
        </MenuDrowdownWrapper>
      </Menu.Sub>

      <Menu.Item leftSection={<UpArrowIcon />} onClick={loadLayout}>
        {t('task-bar.load-settings')}
      </Menu.Item>

      <Menu.Item leftSection={<SaveIcon />} onClick={saveLayout}>
        {t('task-bar.save-settings')}
      </Menu.Item>

      <Menu.Divider />

      <Menu.Sub>
        <Menu.Sub.Target>
          <Menu.Sub.Item leftSection={<SettingsIcon />}>
            {t('gui-settings.label')}
          </Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          <Menu.Label>
            <Group gap={'xs'}>
              {t('gui-settings.visibility-level.label')}
              <InfoBox>{t('gui-settings.visibility-level.tooltip')}</InfoBox>
            </Group>
          </Menu.Label>
          <Container>
            <Radio.Group
              value={propertyVisibility?.toString()}
              onChange={(newValue) => setPropertyVisibility(parseInt(newValue))}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <Stack gap={'xs'}>
                {userLevelOptions ? (
                  Object.entries(userLevelOptions).map(([key, option]) => (
                    <Radio key={key} aria-label={option} label={option} value={key} />
                  ))
                ) : (
                  <LoadingBlocks />
                )}
              </Stack>
            </Radio.Group>
          </Container>

          <Menu.Label mt={'xs'}>
            <Group gap={'xs'}>
              {t('scale-settings.label')}
              <InfoBox>{t('scale-settings.tooltip')}</InfoBox>
            </Group>
          </Menu.Label>
          <Container>
            {guiScale ? (
              <Slider
                defaultValue={guiScale}
                min={0.1}
                max={2}
                step={0.01}
                label={(value) => `${Math.round(value * 100)}%`}
                onChangeEnd={(value) => setGuiScale(value)}
                marks={[
                  { value: 0.1, label: '10%' },
                  { value: 1, label: '100%' },
                  { value: 2, label: '200%' }
                ]}
                miw={170}
                mb={'lg'} // Needed for marks to fit in menu
              />
            ) : (
              <LoadingBlocks n={1} />
            )}
          </Container>
        </Menu.Sub.Dropdown>
      </Menu.Sub>

      <Menu.Sub>
        <Menu.Sub.Target>
          <Menu.Sub.Item leftSection={<NotificationsIcon />}>
            {t('notifications.label')}
          </Menu.Sub.Item>
        </Menu.Sub.Target>

        <MenuDrowdownWrapper isSubMenu shouldLimitHeight>
          <Menu.Label>
            <Group gap={'xs'}>{t('notifications.label')}</Group>
          </Menu.Label>
          <Container>
            <BoolInput
              value={logNotifications}
              label={t('notifications.show-notifications')}
              onChange={(value) => dispatch(showNotifications(value))}
            />
          </Container>
          <Menu.Label>
            <Group gap={'xs'}>
              {t('notifications.log-level.label')}
              <InfoBox>{t('notifications.log-level.tooltip')}</InfoBox>
            </Group>
          </Menu.Label>
          <Container>
            <Radio.Group
              value={notificationLogLevel}
              onChange={(value) => dispatch(updateLogLevel(value as LogLevel))}
              mb={'xs'}
            >
              <Stack gap={'xs'}>
                {Object.values(LogLevel).map((logLevel) => (
                  <Radio
                    key={logLevel}
                    value={logLevel}
                    label={logLevel}
                    aria-label={logLevel}
                  />
                ))}
              </Stack>
            </Radio.Group>
          </Container>
          <Menu.Item
            onClick={() => notifications.clean()}
            leftSection={<DeleteIcon size={IconSize.sm} />}
          >
            {t('notifications.clear-notifications')}
          </Menu.Item>
        </MenuDrowdownWrapper>
      </Menu.Sub>
    </TopBarMenuWrapper>
  );
}
