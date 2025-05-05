import { notifications } from '@mantine/notifications';

import { LogLevel } from '@/types/enums';

export function showNotification(
  title: string,
  message: React.ReactNode,
  level: LogLevel
) {
  const color = {
    [LogLevel.Info]: 'white',
    [LogLevel.Warning]: 'yellow',
    [LogLevel.Error]: 'red'
  };

  const log = {
    // eslint-disable-next-line no-console
    [LogLevel.Info]: console.log,
    // eslint-disable-next-line no-console
    [LogLevel.Warning]: console.warn,
    // eslint-disable-next-line no-console
    [LogLevel.Error]: console.error
  };

  notifications.show({
    title: title,
    message: message,
    color: color[level]
  });

  log[level](message);
}
