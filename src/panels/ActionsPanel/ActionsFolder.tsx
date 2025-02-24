import { Button, Text } from '@mantine/core';

import { FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

interface Props {
  folder: string;
  height: number;
}

export function ActionsFolder({ folder, height }: Props) {
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  const dispatch = useAppDispatch();

  function addNavPath(path: string): void {
    const newPath = `${navigationPath}/${path}`.replace('//', '/');
    dispatch(setActionsPath(newPath));
  }

  return (
    <Button
      leftSection={<FolderIcon />}
      onClick={() => addNavPath(folder)}
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
