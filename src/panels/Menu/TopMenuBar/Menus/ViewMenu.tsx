import {
  Button,
  Checkbox,
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
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import {
  ChevronRightIcon,
  DeleteIcon,
  SaveIcon,
  SettingsIcon,
  TaskBarIcon,
  UpArrowIcon
} from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  resetTaskbarItems,
  setMenuItemsOrder,
  setMenuItemVisible
} from '@/redux/local/localSlice';
import { showNotifications, updateLogLevel } from '@/redux/logging/loggingSlice';
import { IconSize, LogLevel } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems, useStoredLayout } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const defaultTaskbar = useAppSelector((state) => state.profile.uiPanelVisibility);
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
  const dispatch = useAppDispatch();

  const userLevelOptions = propertyVisibilityMetadata?.additionalData.options;

  function resetTaskbar() {
    dispatch(resetTaskbarItems());

    // Panel visibility settings
    Object.entries(defaultTaskbar).forEach(([key, value]) => {
      dispatch(setMenuItemVisible({ id: key, visible: value }));
    });
  }

  return (
    <TopBarMenuWrapper targetTitle={'View'}>
      <TopBarMenuWrapper
        targetTitle={
          <Menu.Item
            leftSection={<TaskBarIcon />}
            rightSection={<ChevronRightIcon size={IconSize.sm} />}
          >
            Task Bar
          </Menu.Item>
        }
        position={'right-start'}
        withinPortal={false}
        closeOnItemClick={false}
      >
        <Menu.Label pr={0}>
          <Group justify={'space-between'}>
            Toggle Task Bar Items
            <Button size={'xs'} onClick={resetTaskbar}>
              Reset
            </Button>
          </Group>
        </Menu.Label>
        <DragReorderList
          id={'viewMenu'}
          data={menuItems}
          dragHandlePosition={'right'}
          keyFunc={(item) => item.id}
          onDragEnd={({ updatedData }) => {
            dispatch(setMenuItemsOrder(updatedData));
          }}
          renderFunc={(itemConfig) => {
            const item = menuItemsData[itemConfig.id];
            return (
              <Menu.Item
                key={item.componentID}
                leftSection={
                  <Group>
                    <CheckboxIndicator checked={itemConfig.visible} />
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
      </TopBarMenuWrapper>

      <Menu.Item leftSection={<UpArrowIcon />} onClick={loadLayout}>
        Load Task Bar Settings
      </Menu.Item>

      <Menu.Item leftSection={<SaveIcon />} onClick={saveLayout}>
        Save Task Bar Settings
      </Menu.Item>

      <Menu.Divider />

      <TopBarMenuWrapper
        targetTitle={
          <Menu.Item
            leftSection={<SettingsIcon />}
            rightSection={<ChevronRightIcon size={IconSize.sm} />}
          >
            GUI Settings
          </Menu.Item>
        }
        position={'right-start'}
        withinPortal={false}
        closeOnItemClick={false}
      >
        <Menu.Label>
          <Group gap={'xs'}>
            Visibility Level
            <InfoBox>
              {`Controls what settings will be exposed in the interface. Increase the
                level to reveal more advanced settings.`}
            </InfoBox>
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
            Scale
            <InfoBox>Increase or decrease the scale of the GUI.</InfoBox>
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

        <Menu.Label>
          <Group gap={'xs'}>
            Notifications
            <InfoBox>Controls which messages will be shown from OpenSpace</InfoBox>
          </Group>
        </Menu.Label>
        <Container>
          <Checkbox
            label={'Show Notifications'}
            checked={logNotifications}
            onChange={(event) => {
              dispatch(showNotifications(event.currentTarget.checked));
            }}
            mb={'xs'}
          />
        </Container>
        <Menu.Label>Set Min OpenSpace Log Level</Menu.Label>
        <Container>
          <Radio.Group
            value={notificationLogLevel}
            onChange={(value) => dispatch(updateLogLevel(value as LogLevel))}
            mb={3}
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
          Clear All Notifications
        </Menu.Item>
      </TopBarMenuWrapper>
    </TopBarMenuWrapper>
  );
}
