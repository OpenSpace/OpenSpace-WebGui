import { useTranslation } from 'react-i18next';
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

export function ScreenSpaceRenderableTypeIcon({ type, size }: Props) {
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'type-icon-tooltips'
  });

  const TypeConfig = {
    ScreenSpaceBrowser: { label: t('browser'), Icon: WebIcon },
    ScreenSpaceImageLocal: { label: t('image'), Icon: InsertPhotoIcon },
    ScreenSpaceImageOnline: { label: t('image'), Icon: InsertPhotoIcon },
    ScreenSpaceVideo: { label: t('video'), Icon: VideoIcon },
    ScreenSpaceRenderableRenderable: { label: t('renderable'), Icon: SceneIcon },
    ScreenSpaceText: { label: t('text'), Icon: TextIcon },
    ScreenSpaceDate: { label: t('date'), Icon: CalendarIcon },
    ScreenSpaceSkyBrowser: { label: t('sky-browser'), Icon: TelescopeIcon },
    ScreenSpaceInsetBlackout: { label: t('blackout-inset'), Icon: ShapeIcon },
    ScreenSpaceTimeVaryingImageOnline: {
      label: t('time-varying-image'),
      Icon: FileClockIcon
    },
    ScreenSpaceDashboard: { label: t('dashboard'), Icon: TextShortIcon }
  } as const;

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
