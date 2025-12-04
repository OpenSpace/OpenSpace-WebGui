import { Code, Group, MantineStyleProps } from '@mantine/core';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props extends MantineStyleProps {
  uri: string;
}

function CopyUriButton({ uri, ...styleProps }: Props) {
  if (!uri) {
    return <></>;
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'} {...styleProps}>
      <Code>{uri}</Code>
      <CopyToClipboardButton value={uri} />
    </Group>
  );
}

export default CopyUriButton;
