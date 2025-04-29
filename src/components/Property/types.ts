import { Uri } from '@/types/types';

// These props are the same for all property types
export interface PropertyProps {
  uri: Uri;
  readOnly: boolean;
}
