import { Button, Group, Text, Tooltip } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { ClockOffIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, sgnRenderableUri } from '@/util/propertyTreeHelpers';

import { useTimeFrame } from '../hooks';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';

interface Props {
  uri: Uri;
  label?: string;
  onClick?: () => void;
  leftSection?: React.ReactNode; // If specified, replaces the checkbox if the node has an attached renderable
}

export function SceneGraphNodeHeader({ uri, label, onClick, leftSection }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);
  const { timeFrame, isInTimeFrame } = useTimeFrame(uri);

  const renderableUri = sgnRenderableUri(uri);
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  if (!propertyOwner) {
    return <></>;
  }

  const name = label ?? displayName(propertyOwner);

  // This title button has a lot of styling related setting to control how it wraps when
  // the header is resized.
  const titleButton = (
    <Button
      h={'fit-content'}
      variant={'subtle'}
      p={0}
      size={'compact-sm'}
      onClick={onClick}
      justify={'start'}
      flex={1}
    >
      <Text mah={80} ta={'left'} style={{ textWrap: 'pretty', wordBreak: 'break-word' }}>
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
          label={`This node is currently hidden since the time is outside its specified
            time frame. It will not be visible even if enabled.`}
          w={300}
          multiline
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
      leftSection={leftSection ?? visibilityControl}
      rightSection={
        <Group wrap={'nowrap'} gap={'xs'}>
          <NodeNavigationButton
            size={'sm'}
            type={NavigationType.Focus}
            variant={'subtle'}
            identifier={propertyOwner.identifier}
          />
          <SceneGraphNodeMoreMenu uri={uri} />
        </Group>
      }
    />
  );
}
