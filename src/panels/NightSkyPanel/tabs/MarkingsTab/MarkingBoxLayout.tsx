import { Skeleton, Stack } from '@mantine/core';

import { ToggleCard } from '@/components/ToggleCard/ToggleCard';

interface Props {
  title: string;
  icon: React.JSX.Element;
  isLoading?: boolean;
  onClick: () => void;
  checked: boolean;
}

export function MarkingBoxLayout({ title, icon, isLoading, onClick, checked }: Props) {
  return (
    <Skeleton visible={isLoading}>
      <ToggleCard checked={checked} onClick={onClick} p={'xs'}>
        <Stack gap={2} align={'center'} style={{ overflow: 'hidden' }}>
          {icon}
          <span>{title}</span>
        </Stack>
      </ToggleCard>
    </Skeleton>
  );
}
