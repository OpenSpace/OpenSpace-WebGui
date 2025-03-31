import { ActionIcon } from '@mantine/core';

import { usePropertyOwner } from '@/hooks/propertyOwner';
import { OpenInNewIcon } from '@/icons/icons';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function OpenSgnInNewWindowButton({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <></>;
  }

  const name = displayName(propertyOwner);

  function openInNewWindow() {
    addWindow(<SceneGraphNodeView uri={uri} showOpenInNewWindow={false} />, {
      id: 'sgn-' + uri,
      title: name,
      position: 'float'
    });
  }

  return (
    <ActionIcon onClick={openInNewWindow} size={'sm'} flex={0}>
      <OpenInNewIcon />
    </ActionIcon>
  );
}
