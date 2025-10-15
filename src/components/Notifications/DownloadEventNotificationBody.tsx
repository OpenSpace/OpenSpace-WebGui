import { MantineColor, Progress } from '@mantine/core';

import { roundTo } from '@/util/numeric';

import { TruncatedText } from '../TruncatedText/TruncatedText';

interface Base {
  message: string;
  color?: MantineColor;
  animated?: boolean;
}

interface WithSize extends Base {
  downloadedSize: number;
  totalSize: number;
  downloadProgress?: never;
}

interface WithProgress extends Base {
  downloadProgress: number;
  downloadedSize?: never;
  totalSize?: never;
}

type Props = WithSize | WithProgress;

export function DownloadEventNotificationBody({
  message,
  color,
  animated = true,
  downloadedSize,
  totalSize,
  downloadProgress
}: Props) {
  const downloadedProgress = downloadProgress ?? (downloadedSize / totalSize) * 100;
  const showDownloadTextProgress =
    downloadedSize !== undefined && totalSize !== undefined;

  return (
    <>
      <TruncatedText tooltipProps={{ zIndex: 1000 }}>{message}</TruncatedText>
      {showDownloadTextProgress && (
        <TruncatedText tooltipProps={{ zIndex: 1000 }}>
          {roundTo(downloadedSize, 2)} MB / {roundTo(totalSize, 2)} MB
        </TruncatedText>
      )}

      <Progress value={downloadedProgress} color={color} animated={animated} striped />
    </>
  );
}
