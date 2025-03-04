import { NumericProperty, NumericPropertyProps } from './NumericProperty';

export function IntNumericProperty(props: NumericPropertyProps) {
  return <NumericProperty {...props} isInt />;
}
