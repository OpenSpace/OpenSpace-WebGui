import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';

import { CopyIcon } from '@/icons/icons';

interface Props {
  value: string;
}

export function CopyToClipboardButton({ value }: Props) {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position={'right'}>
          <ActionIcon color={copied ? 'teal' : 'gray'} variant={'subtle'} onClick={copy}>
            {copied ? <CopyIcon /> : <CopyIcon />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
