import { ListProperty, ListPropertyProps } from './ListProperty';

export function FloatListProperty(props: ListPropertyProps) {
  return <ListProperty {...props} valueType={'float'} />;
}
