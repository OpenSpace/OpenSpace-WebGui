import { Button, Menu } from '@mantine/core';

export function HelpMenu() {
  return (
    <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
      <Menu.Target>
        <Button size={'xs'} color={'gray'}>
          Help
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Open Web Tutorials</Menu.Item>
        <Menu.Item>Open Getting Started Tour</Menu.Item>
        <Menu.Divider />
        <Menu.Item>Send Feedback</Menu.Item>
        <Menu.Divider />
        <Menu.Item>Toggle Console</Menu.Item>
        <Menu.Item>Open GUI in Browser</Menu.Item>
        <Menu.Divider />
        <Menu.Item>Quit OpenSpace</Menu.Item>
        <Menu.Divider />
        <Menu.Item>About</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
