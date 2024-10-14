import { useOpenSpaceApi } from '@/api/hooks';
import { Action } from 'src/types/types';
import { Button, Stack, Group } from '@mantine/core';
import { MdLaunch } from 'react-icons/md';
import { Tooltip } from '@/components/Tooltip/Tooltip';

interface Props {
  action: Action;
}

export function ActionsButton({ action }: Props) {
  const openspaceApi = useOpenSpaceApi();
  const isLocal = action.synchronization === false;

  function handleClick() {
    openspaceApi?.action.triggerAction(action.identifier);
  }

  return (
    <Button onClick={handleClick} style={{ height: `120px` }}>
      <Stack>
        <MdLaunch />
        <p>{isLocal && <span> (Local)</span>}</p>
        <Group>
          {action.name} {action.documentation && <Tooltip text={action.documentation} />}
        </Group>
      </Stack>
    </Button>
  );
}
