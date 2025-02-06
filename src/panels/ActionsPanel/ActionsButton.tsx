import { Button, Group, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
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
  // TODO anden88 2025-02-06: make this into a css variable
  const height = 80;

  if (!action) {
    return <></>;
  }
  const isLocal = action.synchronization === false;

  function handleClick() {
    openspaceApi?.action.triggerAction(action!.identifier);
  }

  return (
    <Group
      gap={0}
      p={2}
      bg={'var(--mantine-color-gray-8)'}
      style={{ borderRadius: 'var(--mantine-radius-default)' }}
    >
      <Button onClick={handleClick} h={height} px={5} flex={1}>
        <Text style={{ whiteSpace: 'wrap' }}>{action.name}</Text>
      </Button>
      <Stack
        h={height}
        justify={'center'}
        align={'center'}
        px={5}
        bg={'var(--mantine-color-gray-8)'}
      >
        {action.documentation && <InfoBox text={action.documentation} />}
        {isLocal && <Text> (L)</Text>}
      </Stack>
    </Group>
  );
}
