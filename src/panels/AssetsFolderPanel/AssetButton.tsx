import { Button, Card, Group, Text } from '@mantine/core';

import { CopyToClipboardButton } from '../../components/CopyToClipboardButton/CopyToClipboardButton';

import { Asset } from './types';

interface Props {
  onClick: () => void;
  asset: Asset;
}
export function AssetButton({ asset, onClick }: Props) {
  return (
    <Card h={80} p={4}>
      <Group gap={0} h={'100%'}>
        <Button
          color={'blue'}
          variant={'filled'}
          onClick={onClick}
          h={'100%'}
          p={5}
          mr={5}
          flex={1}
        >
          <Text lineClamp={3} style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>
            {asset.name}
          </Text>
        </Button>
        <CopyToClipboardButton value={asset.path.replaceAll('\\', '/')} />
      </Group>
    </Card>
  );
}
