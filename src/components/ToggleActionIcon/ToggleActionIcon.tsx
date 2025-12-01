import { ActionIcon, ActionIconProps } from '@mantine/core';

interface Props extends ActionIconProps {
  isOn: boolean;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  onClick: (isOn: boolean) => void;
}

export function ToggleActionIcon({ isOn, iconOn, iconOff, onClick, ...props }: Props) {
  return (
    <ActionIcon
      variant={isOn ? 'filled' : 'light'}
      role={'switch'}
      aria-pressed={isOn}
      onClick={() => onClick(!isOn)}
      {...props}
    >
      {isOn ? iconOn : iconOff}
    </ActionIcon>
  );
}
