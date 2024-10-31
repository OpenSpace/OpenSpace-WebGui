import { StringInput } from '@/components/Input/StringInput';

import { PropertyLabel } from '../PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: string) => void;
  value: string;
}

// TODO: The text edit that sets value on enter should be a more general component
export function StringProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value
}: Props) {
  // const [currentValue, setCurrentValue] = useState<string>(value);

  // function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
  //   if (event.key === 'Enter') {
  //     setPropertyValue(currentValue);
  //     event.currentTarget.blur();
  //   } else if (event.key === 'Escape') {
  //     setCurrentValue(value);
  //     event.currentTarget.blur();
  //   }
  // }

  // return (
  //   <TextInput
  //     value={currentValue}
  //     onChange={(event) => setCurrentValue(event.currentTarget.value)}
  //     onKeyUp={(event) => onKeyUp(event)}
  //     disabled={disabled}
  //     label={<PropertyLabel label={name} tip={description} />}
  //   />
  // );

  return <StringInput
    disabled={disabled}
    onEnter={setPropertyValue}
    defaultValue={value}
    label={<PropertyLabel label={name} tip={description} />}
  />
}
