import { BiChevronRight } from 'react-icons/bi';
import { Group } from '@mantine/core';

interface Props {
  expanded: boolean;
  text: React.ReactNode;
}

export function CollapsibleHeader({ expanded, text }: Props) {
  return (
    <Group gap={5} wrap="nowrap">
      <BiChevronRight
        size={18}
        style={{
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}
      />
      {text}
    </Group>
  );
}
