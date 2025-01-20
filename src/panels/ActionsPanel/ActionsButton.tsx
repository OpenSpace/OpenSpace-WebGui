import { Button, Group, Stack } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { LaunchIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

interface Props {
  uri?: string;
  action?: Action;
}

export function ActionsButton({ uri, action: _action }: Props) {
  const openspaceApi = useOpenSpaceApi();
  const allActions = useAppSelector((state) => state.actions.actions);
  const action = uri ? allActions.find((action) => action.identifier === uri) : _action;

  if (!action) {
    return <></>;
  }
  const isLocal = action.synchronization === false;

  function handleClick() {
    openspaceApi?.action.triggerAction(action!.identifier);
  }

  return (
    <Button onClick={handleClick} style={{ height: `120px` }}>
      <Stack>
        <LaunchIcon />
        <p>{isLocal && <span> (Local)</span>}</p>
        <Group>
          {action.name} {action.documentation && <Tooltip text={action.documentation} />}
        </Group>
      </Stack>
    </Button>
  );
}
