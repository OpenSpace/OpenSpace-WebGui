import 'i18next';

import type { Resources } from '@/localization/resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources['en'];
  }
}
