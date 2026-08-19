import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { DeleteIcon, OpenWindowIcon, VerticalDotsIcon } from '@/icons/icons';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { useRemoveScreenSpaceRenderableModal } from '@/util/removeModalsHooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ScreenSpaceRenderableView } from './ScreenSpaceRenderableView';

interface Props {
  uri: Uri;
}

export function ScreenSpaceRenderableMoreMenu({ uri }: Props) {
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'more-menu'
  });

  const propertyOwner = usePropertyOwner(uri);
  const confirmRemove = useRemoveScreenSpaceRenderableModal();

  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <></>;
  }

  const name = displayName(propertyOwner);

  function openInNewWindow() {
    addWindow(<ScreenSpaceRenderableView uri={uri} />, {
      id: 'screenspace-' + uri,
      title: name,
      position: 'right'
    });
  }

  return (
    <Menu position={'left-start'} withArrow closeOnItemClick>
      <Menu.Target>
        <ActionIcon size={'sm'} aria-label={t('aria-label')}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown maw={150}>
        <Menu.Label>
          <TruncatedText size={'xs'}>{name}</TruncatedText>
        </Menu.Label>
        <Menu.Item onClick={openInNewWindow} leftSection={<OpenWindowIcon />}>
          {t('pop-out')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color={'red'}
          onClick={() => confirmRemove(propertyOwner.identifier, propertyOwner.name)}
          leftSection={<DeleteIcon />}
        >
          {t('delete-button.label')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
