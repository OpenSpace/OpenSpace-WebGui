import { OpenSpaceProperty, PropertyValue } from '@/types/types';

export interface PropertyPayload {
  value?: PropertyValue;
  metaData?: OpenSpaceProperty['Description'];
}
