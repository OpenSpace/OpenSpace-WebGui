import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Group, Menu, Stack } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useIsSgnFocusable } from '@/hooks/sceneGraphNodes/hooks';
import { DeleteIcon, OpenWindowIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { identifierFromUri } from '@/util/uris';
import { useRemoveSceneGraphNodeModal } from '@/util/useRemoveSceneGraphNode';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMoreMenu({ uri }: Props) {
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.more-menu'
  });

  const propertyOwner = usePropertyOwner(uri);
  const anchorNode = useAnchorNode();
  const confirmRemoveSgn = useRemoveSceneGraphNodeModal();
  const isFocusable = useIsSgnFocusable(uri);

  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <></>;
  }

  const name = displayName(propertyOwner);

  function openInNewWindow() {
    addWindow(<SceneGraphNodeView uri={uri} />, {
      id: 'sgn-' + uri,
      title: name,
      position: 'right'
    });
  }

  return (
    <Menu position={'right-start'} withArrow>
      <Menu.Target>
        <ActionIcon size={'sm'} aria-label={t('aria-label')}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{name}</Menu.Label>
        <Menu.Item
          onClick={openInNewWindow}
          leftSection={<OpenWindowIcon size={IconSize.sm} />}
        >
          {t('pop-out')}
        </Menu.Item>

        {isFocusable && (
          <>
            <Menu.Divider />
            <Stack gap={'xs'}>
              <NodeNavigationButton
                type={NavigationType.Fly}
                identifier={propertyOwner.identifier}
                showLabel
              />
              <NodeNavigationButton
                type={NavigationType.Jump}
                identifier={propertyOwner.identifier}
                showLabel
              />
              <NodeNavigationButton
                type={NavigationType.Frame}
                identifier={propertyOwner.identifier}
                showLabel
              />
            </Stack>
          </>
        )}
        <Menu.Divider />
        <Group gap={'xs'}>
          <MaybeTooltip
            label={t('delete-button.cannot-delete-current-focus')}
            showTooltip={anchorNode?.identifier === propertyOwner.identifier}
          >
            <Menu.Item
              disabled={anchorNode?.identifier === propertyOwner.identifier}
              onClick={() => confirmRemoveSgn(identifierFromUri(uri), propertyOwner.name)}
              color={'red'}
              leftSection={<DeleteIcon />}
              flex={1}
            >
              {t('delete-button.label')}
            </Menu.Item>
          </MaybeTooltip>
          <Box pr={'xs'}>
            <InfoBox>
              {t('delete-button.info')}
              <CopyUriButton uri={uri} />
            </InfoBox>
          </Box>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
