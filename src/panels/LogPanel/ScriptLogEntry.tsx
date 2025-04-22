import { useState } from 'react';
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { RerunScriptIcon } from '@/icons/icons';

interface Props {
  script: string;
}

export function ScriptLogEntry({ script }: Props) {
  const luaApi = useOpenSpaceApi();
  const [expanded, setExpanded] = useState(false);

  function runScript() {
    luaApi?.scheduleScript(script, 0);
  }

  return (
    <Group wrap={'nowrap'} justify={'space-between'} align={'start'}>
      <Text
        truncate={expanded ? undefined : 'end'}
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', overflowWrap: 'anywhere' }}
      >
        {script}
      </Text>
      <Group wrap={'nowrap'} gap={'xs'}>
        <CopyToClipboardButton value={script} />
        <Tooltip label={'Rerun script'}>
          <ActionIcon
            onClick={runScript}
            variant={'light'}
            color={'green'}
            aria-label={'Rerun script'}
          >
            <RerunScriptIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
