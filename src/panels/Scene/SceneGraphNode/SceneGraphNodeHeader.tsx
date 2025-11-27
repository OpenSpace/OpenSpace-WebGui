import { useTranslation } from 'react-i18next';
import { Button, Group, Tooltip } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useIsSgnFocusable } from '@/hooks/sceneGraphNodes/hooks';
import { ClockOffIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, isRenderable } from '@/util/propertyTreeHelpers';

import { useTimeFrame } from '../hooks';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';
import { SceneGraphNodeVisibilityCheckbox } from './SceneGraphNodeVisibilityCheckbox';

interface Props {
  uri: Uri;
  onClick?: () => void;
  label?: string;
}

export function SceneGraphNodeHeader({ uri, onClick, label }: Props) {
  const { t } = useTranslation('panel-scene', { keyPrefix: 'scene-graph-node.header' });
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
      <TruncatedText
        ta={'left'}
        style={{ textWrap: 'pretty', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        lineClamp={3}
      >
        {name}
      </TruncatedText>
    </Button>
  );

  // TODO: Make sure that the timeframe information is accessible
  const visibilityControl = hasRenderable && (
    <Group gap={'xs'}>
      <SceneGraphNodeVisibilityCheckbox uri={renderableUri} />
      {timeFrame && !isInTimeFrame && (
        <Tooltip label={t('out-of-timeframe-tooltip')} position={'top'}>
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
