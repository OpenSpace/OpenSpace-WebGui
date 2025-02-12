import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';

import { CopyIcon } from '@/icons/icons';

interface Props {
  value: string;
}

export function CopyToClipboardButton({ value }: Props) {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} position={'right'}>
          <ActionIcon
            color={copied ? 'teal' : 'gray'}
            size={'sm'}
            variant={'subtle'}
            onClick={copy}
          >
            <CopyIcon />
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
