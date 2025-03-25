import { Code,Group } from '@mantine/core';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props {
  uri: string;
}

function CopyUriButton({ uri }: Props) {
  return (
    <>
      {uri && (
        <Group pt={'sm'}>
          <Code>Copy URI:</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      )}
    </>
  );
}

export default CopyUriButton;
