import { ListProperty, ListPropertyProps } from './ListProperty';

export function IntListProperty(props: ListPropertyProps) {
  return <ListProperty {...props} valueType={'int'} />;
}
