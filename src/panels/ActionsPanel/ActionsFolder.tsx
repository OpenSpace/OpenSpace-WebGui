import { Button, Text } from '@mantine/core';

import { FolderIcon } from '@/icons/icons';

import { useGoToFolder } from './hooks';

interface Props {
  folder: string;
  height: number;
}

export function ActionsFolder({ folder, height }: Props) {
  const goToPath = useGoToFolder();

  return (
    <Button
      leftSection={<FolderIcon />}
      onClick={() => goToPath(folder)}
      variant={'default'}
      fullWidth
      h={height}
      key={folder}
    >
      <Text lineClamp={3} style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>
        {folder}
      </Text>
    </Button>
  );
}
