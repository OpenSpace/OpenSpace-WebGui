import { ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Text } from '@mantine/core';

interface Props {
  path: (React.JSX.Element | string)[];
}

export function FolderPath({ path }: Props) {
  return (
    <Text style={{ display: 'flex', alignItems: 'center' }}>
      {path.map((element, index) => (
        <>
          {index > 0 && (
            <ChevronRightIcon size={IconSize.sm} style={{ margin: '0 4px' }} />
          )}
          {element}
        </>
      ))}
    </Text>
  );
}
