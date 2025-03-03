import { ListProperty, ListPropertyProps } from './ListProperty';

export function FloatingNumberListProperty(props: ListPropertyProps) {
  return <ListProperty {...props} valueType={'float'} />;
}
