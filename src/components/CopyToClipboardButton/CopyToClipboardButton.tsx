import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  ActionIconProps,
  Button,
  ButtonProps,
  CopyButton,
  Menu,
  MenuItemProps,
  Tooltip
} from '@mantine/core';

import { CopyIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface BaseProps {
  value: string;
  copyTooltipLabel?: string;
  iconSize?: IconSize;
}

interface ActionIconBaseProps
  extends BaseProps,
    Omit<ActionIconProps, 'onClick' | 'children'> {
  mode?: 'actionIcon';
  copyLabel?: never;
  iconPosition?: never;
}

interface ButtonBaseProps extends BaseProps, Omit<ButtonProps, 'onClick' | 'children'> {
  mode: 'button';
  copyLabel?: string;
  iconPosition?: 'left' | 'right';
}

interface MenuItemBaseProps
  extends BaseProps,
    Omit<MenuItemProps, 'onClick' | 'children'> {
  mode: 'menuItem';
  copyLabel?: string;
  iconPosition?: 'left' | 'right';
}

type Props = ActionIconBaseProps | ButtonBaseProps | MenuItemBaseProps;

// Unfortunately destructuring the props loses the relationship between mode and the
// Mantine specific base props. So we have to keep the props object to satisfy TypeScript
// in the switch-case
export function CopyToClipboardButton({
  value,
  copyTooltipLabel,
  iconSize,
  ...props
}: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'copy-to-clipboard-button' });

  function tooltipLabel(copied: boolean) {
    if (copied) {
      return t('tooltip.copied');
    }
    return copyTooltipLabel ?? t('tooltip.copy');
  }

  function renderButtonType(copied: boolean, copy: () => void) {
    switch (props.mode) {
      case 'button': {
        const { copyLabel, iconPosition = 'right', ...buttonProps } = props;

        return (
          <Button
            {...buttonProps}
            color={copied ? 'teal' : 'gray'}
            variant={'light'}
            onClick={copy}
            leftSection={
              iconPosition === 'left' ? <CopyIcon size={iconSize} /> : undefined
            }
            rightSection={
              iconPosition === 'right' ? <CopyIcon size={iconSize} /> : undefined
            }
          >
            {copyLabel ?? t('label')}
          </Button>
        );
      }
      case 'menuItem': {
        const { copyLabel, iconPosition = 'right', ...menuItemProps } = props;

        return (
          <Menu.Item
            {...menuItemProps}
            color={copied ? 'teal' : undefined}
            onClick={copy}
            leftSection={
              iconPosition === 'left' ? <CopyIcon size={iconSize} /> : undefined
            }
            rightSection={
              iconPosition === 'right' ? <CopyIcon size={iconSize} /> : undefined
            }
          >
            {copyLabel ?? t('label')}
          </Menu.Item>
        );
      }
      case 'actionIcon':
      default: {
        return (
          <ActionIcon
            {...props}
            color={copied ? 'teal' : 'gray'}
            size={props.size ?? 'sm'}
            variant={props.variant ?? 'subtle'}
            onClick={copy}
            aria-label={tooltipLabel(copied)}
          >
            <CopyIcon size={iconSize} />
          </ActionIcon>
        );
      }
    }
  }

  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => {
        return (
          <Tooltip label={tooltipLabel(copied)} position={'right'}>
            {renderButtonType(copied, copy)}
          </Tooltip>
        );
      }}
    </CopyButton>
  );
}
