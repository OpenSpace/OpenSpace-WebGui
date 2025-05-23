import { Code, Group } from '@mantine/core';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props {
  uri: string;
}

function CopyUriButton({ uri }: Props) {
  if (!uri) {
    return <></>;
  }

  return (
    <Group pt={'sm'} gap={'xs'} wrap={'nowrap'}>
      <Code>{uri}</Code>
      <CopyToClipboardButton value={uri} />
    </Group>
  );
}

export default CopyUriButton;
