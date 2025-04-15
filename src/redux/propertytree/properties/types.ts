import { AnyProperty } from '@/types/Property/property';

export interface PropertyPayload {
  value?: AnyProperty['value'];
  metaData?: AnyProperty['metaData'];
}
