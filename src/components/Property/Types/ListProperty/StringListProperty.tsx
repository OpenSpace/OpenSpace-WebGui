import { ListProperty, ListPropertyProps } from './ListProperty';

export function StringListProperty(props: ListPropertyProps) {
  return <ListProperty {...props} valueType={'string'} />;
}
