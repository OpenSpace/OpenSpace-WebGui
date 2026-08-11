import { MdOutlineNote } from 'react-icons/md';
import { Tooltip } from '@mantine/core';

import { InsertPhotoIcon, SceneIcon, VideoIcon, WebIcon } from '@/icons/icons';

interface Props {
  type: string | undefined;
  size?: number;
}

export function ScreenSpaceRenderableTypeIcon({ type, size }: Props) {
  switch (type) {
    case 'ScreenSpaceBrowser':
      return (
        <Tooltip label={'Web Browser'}>
          <WebIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceImageLocal':
    case 'ScreenSpaceImageOnline':
      return (
        <Tooltip label={'Image'}>
          <InsertPhotoIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceVideo':
      return (
        <Tooltip label={'Video'}>
          <VideoIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceRenderableRenderable':
      return (
        <Tooltip label={'Renderable'}>
          <SceneIcon size={size} />
        </Tooltip>
      );
    default:
      // TODO: deciede on default icon for unknown types
      return (
        <Tooltip label={'Other'}>
          <MdOutlineNote size={size} />
        </Tooltip>
      );
  }
}
