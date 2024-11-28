import { Group, ThemeIcon, UnstyledButton } from '@mantine/core';

import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

interface Props {
  expanded: boolean;
  text: React.ReactNode;
  toggle?: () => void;
}

export function CollapsableHeader({ expanded, text, toggle }: Props) {
  const iconProps = { size: 18, style: { flexShrink: 0 } };
  return (
    <div>
      <UnstyledButton onClick={toggle}>
        <Group gap={5} wrap={'nowrap'}>
          <ThemeIcon variant={'transparent'}>
            {expanded ? (
              <ChevronDownIcon {...iconProps} />
            ) : (
              <ChevronRightIcon {...iconProps} />
            )}
          </ThemeIcon>
          {text}
        </Group>
      </UnstyledButton>
    </div>
  );
}
