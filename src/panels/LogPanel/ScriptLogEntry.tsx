import { useState } from 'react';
import { ActionIcon, Code, Group, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { BoolInput } from '@/components/Input/BoolInput';
import { RerunScriptIcon } from '@/icons/icons';

interface Props {
  script: string;
  index: number;
  isSelected: boolean;
  onToggleSelection: (index: number) => void;
}

export function ScriptLogEntry({ script, index, isSelected, onToggleSelection }: Props) {
  const luaApi = useOpenSpaceApi();
  const [expanded, setExpanded] = useState(false);

  function runScript() {
    luaApi?.scheduleScript(script, 0);
  }

  return (
    <Group wrap={'nowrap'} align={'start'} gap={'xs'}>
      <BoolInput
        value={isSelected}
        name={`Select script ${index}`}
        setValue={() => onToggleSelection(index)}
        showLabel={false}
      />
      <Code color={'dark.7'} w={'100%'}>
        <Text
          truncate={expanded ? undefined : 'end'}
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: 'pointer', wordBreak: 'break-all' }}
          size={'sm'}
        >
          {script}
        </Text>
      </Code>
      <CopyToClipboardButton value={script} />
      <Tooltip label={'Rerun script'}>
        <ActionIcon
          onClick={runScript}
          variant={'light'}
          color={'green'}
          aria-label={'Rerun script'}
          size={'sm'}
        >
          <RerunScriptIcon />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
