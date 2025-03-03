import { ListProperty, ListPropertyProps } from './ListProperty';

export function IntNumberListProperty(props: ListPropertyProps) {
  return <ListProperty {...props} valueType={'int'} />;
}
