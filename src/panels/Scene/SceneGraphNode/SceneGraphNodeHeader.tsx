import { Button, Group, Text, Tooltip } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useIsSgnFocusable } from '@/hooks/sceneGraphNodes/hooks';
import { ClockOffIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, isRenderable } from '@/util/propertyTreeHelpers';

import { useTimeFrame } from '../hooks';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';

interface Props {
  uri: Uri;
  onClick?: () => void;
  label?: string;
}

export function SceneGraphNodeHeader({ uri, onClick, label }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const { timeFrame, isInTimeFrame } = useTimeFrame(uri);
  const isFocusable = useIsSgnFocusable(uri);

  const renderableUri = propertyOwner?.subowners.find((uri) => isRenderable(uri));
  const hasRenderable = renderableUri !== undefined;

  if (!propertyOwner) {
    return <></>;
  }

  const name = label ?? displayName(propertyOwner);

  // This title button has a lot of styling related setting to control how it wraps when
  // the header is resized.
  const titleButton = (
    <Button
      fullWidth
      h={'fit-content'}
      variant={'subtle'}
      p={0}
      size={'compact-sm'}
      onClick={onClick}
      justify={'start'}
      flex={1}
    >
      <Text
        ta={'left'}
        style={{ textWrap: 'pretty', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        lineClamp={3}
      >
        {name}
      </Text>
    </Button>
  );

  // TODO: Make sure that the timeframe information is accessible
  const visibilityControl = hasRenderable && (
    <Group gap={'xs'}>
      <PropertyOwnerVisibilityCheckbox uri={renderableUri} />
      {timeFrame && !isInTimeFrame && (
        <Tooltip
          label={`This node is hidden because the current time is outside its specified
            time frame. It will not be visible even if enabled.`}
          position={'top'}
        >
          <ClockOffIcon />
        </Tooltip>
      )}
    </Group>
  );

  return (
    <ThreePartHeader
      title={onClick ? titleButton : name}
      leftSection={visibilityControl}
      rightSection={
        <Group wrap={'nowrap'} gap={'xs'} flex={0}>
          {isFocusable && (
            <NodeNavigationButton
              size={'sm'}
              type={NavigationType.Focus}
              variant={'subtle'}
              identifier={propertyOwner.identifier}
            />
          )}
          <SceneGraphNodeMoreMenu uri={uri} />
        </Group>
      }
    />
  );
}
