import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AspectRatio,
  BackgroundImage,
  LoadingOverlay,
  MantineStyleProps,
  Text
} from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { useMapPath } from './hooks';

// Settings for the OpenSpace marker and view cone
interface Props extends MantineStyleProps, PropsWithChildren {
  ref?: React.RefObject<HTMLDivElement>;
  refSize?: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export function Map({ ref, refSize, children, style, ...styleProps }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'map' });

  const anchor = useAnchorNode();

  const [mapPath, mapExists] = useMapPath(anchor);

  const timeIsTooFast = useAppSelector(
    (state) => Math.abs(state.time.targetDeltaTime ?? 0) > 87682
  );

  useSubscribeToTime();

  if (!anchor) {
    return (
      <AspectRatio ratio={2} {...styleProps} style={style}>
        <BackgroundImage src={''} />
        <LoadingOverlay visible={true} />
      </AspectRatio>
    );
  }

  if (!mapExists || !anchor) {
    return (
      <Alert variant={'light'} color={'orange'} title={t('no-map.title')}>
        <Text>{t('no-map.description', { name: anchor?.name })}</Text>
      </Alert>
    );
  }
  return (
    <AspectRatio
      ratio={2}
      mx={'auto'}
      miw={300}
      {...styleProps}
      ref={(el) => {
        if (ref && el) {
          ref.current = el;
        }
        if (refSize && el) {
          refSize.current = el;
        }
      }}
      style={style}
    >
      <BackgroundImage
        src={mapPath}
        style={{ position: 'relative' }}
        aria-label={t('aria-labels.map', { name: anchor.name })}
      >
        {!timeIsTooFast && children}
        {timeIsTooFast && (
          <Alert
            variant={'filled'}
            color={'orange'}
            title={t('time-too-fast.title')}
            style={{ position: 'absolute', top: 10, left: 10, right: 10 }}
          >
            {t('time-too-fast.description')}
          </Alert>
        )}
      </BackgroundImage>
    </AspectRatio>
  );
}
