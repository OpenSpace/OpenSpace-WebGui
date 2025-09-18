import { MantineColor, Progress, Text } from '@mantine/core';

interface Props {
  message: string;
  downloadProgress: number;
  color?: MantineColor;
  animated?: boolean;
}
export function DownloadEventNotificationBody({
  message,
  downloadProgress,
  color,
  animated = true
}: Props) {
  return (
    <>
      <Text>{message}</Text>
      <Progress value={downloadProgress} color={color} animated={animated} striped />
    </>
  );
}
