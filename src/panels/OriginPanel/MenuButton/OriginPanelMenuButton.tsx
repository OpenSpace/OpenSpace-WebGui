import { Group, Stack, Text } from '@mantine/core';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { FocusIcon } from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { EngineMode, IconSize } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { RemainingFlightTimeIndicator } from '../RemainingFlightTimeIndicator';

import { CancelFlightButton } from './CancelFlightButton';
import { OriginPanelMenuButtonContent } from './OriginPanelMenuButtonContent';

interface Props {
  id: string;
}

export function OriginPanelMenuButton({ id }: Props) {
  const engineMode = useSubscribeToEngineMode();
  const anchorNode = useAnchorNode();

  const isReady = anchorNode !== undefined;
  const isInFlight = engineMode === EngineMode.CameraPath;

  if (isInFlight) {
    return (
      <Group>
        <RemainingFlightTimeIndicator />
        <CancelFlightButton />
      </Group>
    );
  }

  if (!isReady) {
    return (
      <TaskBarMenuButton id={id} disabled leftSection={<FocusIcon size={IconSize.lg} />}>
        <Stack gap={0}>
          <LoadingBlocks n={1} w={84} />
          <Text ta={'left'}>Focus</Text>
        </Stack>
      </TaskBarMenuButton>
    );
  }
  return (
    <TaskBarMenuButton id={id}>
      <OriginPanelMenuButtonContent />
    </TaskBarMenuButton>
  );
}
