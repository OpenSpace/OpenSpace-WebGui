import { Uri } from '@/types/types';

// These props are the same for all property types
export interface PropertyProps {
  uri: Uri;
  readOnly: boolean;
}

// Confirmation setting for individual properties
export type PropertyConfirmation = 'No' | 'Never' | 'Yes' | 'Always';

// Global confirmation settings for properties
export enum ShowPropertyConfirmationModals {
  Never = 0,
  Default = 1,
  Always = 2
}
