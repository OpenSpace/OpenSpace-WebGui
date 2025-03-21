import { VectorProperty, VectorPropertyProps } from './VectorProperty';

export function IntVectorProperty(props: VectorPropertyProps) {
  return <VectorProperty {...props} isInt />;
}
