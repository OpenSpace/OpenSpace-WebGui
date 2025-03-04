import { StringInput } from '@/components/Input/StringInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: string) => void;
  value: string;
}

export function StringProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value
}: Props) {
  return (
    <StringInput
      disabled={disabled}
      onEnter={setPropertyValue}
      value={value}
      label={<PropertyLabel label={name} tip={description} />}
    />
  );
}
