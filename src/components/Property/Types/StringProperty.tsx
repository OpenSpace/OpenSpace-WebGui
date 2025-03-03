import { StringInput } from '@/components/Input/StringInput';

import { ConcretePropertyBaseProps } from '../types';

interface Props extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: string) => void;
  value: string;
}

export function StringProperty({ name, disabled, setPropertyValue, value }: Props) {
  return (
    <StringInput
      disabled={disabled}
      onEnter={setPropertyValue}
      value={value}
      aria-label={`${name} input`}
    />
  );
}
