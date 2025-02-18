import { Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';

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
  const borderPadding = 4;

  if (!action) {
    return <></>;
  }

  const isLocal = action.synchronization === false;

  function handleClick() {
    openspaceApi?.action.triggerAction(action!.identifier);
  }

  return (
    <Card p={borderPadding} h={height}>
      <Group gap={0}>
        <Button
          onClick={handleClick}
          p={5}
          h={height - 2 * borderPadding - 1}
          flex={1}
          variant={'filled'}
        >
          <Text lineClamp={3} size={'sm'} style={{ whiteSpace: 'wrap' }}>
            {action.name}
          </Text>
        </Button>
        <Stack justify={'center'} align={'center'} px={5}>
          {action.documentation && <InfoBox text={action.documentation} />}
          {isLocal && (
            <Tooltip label={'Local action'} position={'top'}>
              <Badge variant={'light'} circle>
                L
              </Badge>
            </Tooltip>
          )}
        </Stack>
      </Group>
    </Card>
  );
}
