import { Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { KeybindButtons } from '../KeybindsPanel/KeybindButtons';

interface Props {
  height: number;
  uri?: string;
  action?: Action;
}

export function ActionsButton({ uri, action: _action, height }: Props) {
  const openspaceApi = useOpenSpaceApi();
  const allActions = useAppSelector((state) => state.actions.actions);
  const keybinds = useAppSelector((state) => state.actions.keybinds);

  const action = uri ? allActions.find((action) => action.identifier === uri) : _action;
  const keybind = keybinds.find((_keybind) => _keybind.action === action?.identifier);

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
      <Group gap={0} h={'100%'}>
        <Button onClick={handleClick} h={'100%'} p={5} flex={1} variant={'filled'}>
          <Text lineClamp={3} size={'sm'} style={{ whiteSpace: 'wrap' }}>
            {action.name}
          </Text>
        </Button>
        <Stack justify={'center'} align={'center'} px={5}>
          {action.documentation && (
            <InfoBox
              text={
                <Stack gap={'xs'}>
                  <Text>{action.documentation}</Text>
                  {keybind && (
                    <KeybindButtons
                      modifiers={keybind.modifiers}
                      selectedKey={keybind.key}
                    />
                  )}
                </Stack>
              }
            />
          )}
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
