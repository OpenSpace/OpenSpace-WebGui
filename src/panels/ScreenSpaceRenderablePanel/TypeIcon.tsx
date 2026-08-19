import { Tooltip } from '@mantine/core';

import {
  CalendarIcon,
  FileClockIcon,
  InsertPhotoIcon,
  SceneIcon,
  ShapeIcon,
  TelescopeIcon,
  TextIcon,
  TextShortIcon,
  VideoIcon,
  WebIcon
} from '@/icons/icons';

interface Props {
  type: string | undefined;
  size?: number;
}

const TypeConfig = {
  ScreenSpaceBrowser: { label: 'Web page', Icon: WebIcon },
  ScreenSpaceImageLocal: { label: 'Image', Icon: InsertPhotoIcon },
  ScreenSpaceImageOnline: { label: 'Image', Icon: InsertPhotoIcon },
  ScreenSpaceVideo: { label: 'Video', Icon: VideoIcon },
  ScreenSpaceRenderableRenderable: { label: 'Renderable', Icon: SceneIcon },
  ScreenSpaceText: { label: 'Text', Icon: TextIcon },
  ScreenSpaceDate: { label: 'Date', Icon: CalendarIcon },
  ScreenSpaceSkyBrowser: { label: 'SkyBrowser', Icon: TelescopeIcon },
  ScreenSpaceInsetBlackout: { label: 'Blackout inset', Icon: ShapeIcon },
  ScreenSpaceTimeVaryingImageOnline: {
    label: 'Time-varying image',
    Icon: FileClockIcon
  },
  ScreenSpaceDashboard: { label: 'Dashboard', Icon: TextShortIcon }
} as const;

export function ScreenSpaceRenderableTypeIcon({ type, size }: Props) {
  if (!type) {
    return <></>;
  }

  const config = TypeConfig[type as keyof typeof TypeConfig];
  if (!config) {
    return <></>;
  }

  const { label, Icon } = config;

  return (
    <Tooltip label={label}>
      <Icon size={size} />
    </Tooltip>
  );
}
