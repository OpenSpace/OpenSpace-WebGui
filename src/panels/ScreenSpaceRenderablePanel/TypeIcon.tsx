import { Tooltip } from '@mantine/core';

import {
  CalendarIcon,
  InsertPhotoIcon,
  SceneIcon,
  ShapeIcon,
  TelescopeIcon,
  TextIcon,
  TextShortIcon,
  TimeIcon,
  VideoIcon,
  WebIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  type: string | undefined;
  size?: number;
}

export function ScreenSpaceRenderableTypeIcon({ type, size }: Props) {
  switch (type) {
    case 'ScreenSpaceBrowser':
      return (
        <Tooltip label={'Web page'}>
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
    case 'ScreenSpaceText':
      return (
        <Tooltip label={'Text'}>
          <TextIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceDate':
      return (
        <Tooltip label={'Date'}>
          <CalendarIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceSkyBrowser':
      return (
        <Tooltip label={'SkyBrowser'}>
          <TelescopeIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceInsetBlackout':
      return (
        <Tooltip label={'Blackout inset'}>
          <ShapeIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceTimeVaryingImageOnline':
      return (
        <Tooltip label={'Time-varying image'}>
          <TimeIcon size={size} />
        </Tooltip>
      );
    case 'ScreenSpaceDashboard':
      return (
        <Tooltip label={'Dashboard'}>
          <TextShortIcon size={size} />
        </Tooltip>
      );
    default:
      return <></>;
  }
}
