import { useTranslation } from 'react-i18next';

import { TimePart } from './types';

export function useTimePartTranslation() {
  const { t } = useTranslation('panel-time', { keyPrefix: 'time-parts' });

  function translateTimePart(timePart: TimePart, count: number) {
    switch (timePart) {
      case TimePart.Milliseconds:
        return t('milliseconds', { count });
      case TimePart.Seconds:
        return t('seconds', { count });
      case TimePart.Minutes:
        return t('minutes', { count });
      case TimePart.Hours:
        return t('hours', { count });
      case TimePart.Days:
        return t('days', { count });
      case TimePart.Months:
        return t('months', { count });
      case TimePart.Years:
        return t('years', { count });
      default:
        throw new Error(`Missing translation case '${timePart}'`);
    }
  }

  return translateTimePart;
}
