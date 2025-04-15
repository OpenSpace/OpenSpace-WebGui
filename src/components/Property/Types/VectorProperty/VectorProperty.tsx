import { PropertyProps } from '@/components/Property/types';

import { ColorView } from './ViewOptions/ColorView';
import { MinMaxRangeView } from './ViewOptions/MinMaxRange';
import { VectorDefaultView } from './ViewOptions/VectorDefaultView';
import { useProperty } from '@/hooks/properties';

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function VectorProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue, meta] = useProperty('GenericVectorProperty', uri);

  if (!meta || !value) {
    return <></>;
  }

  if (meta.viewOptions?.Color) {
    return (
      <ColorView
        value={value}
        setPropertyValue={setPropertyValue}
        additionalData={meta.additionalData}
        readOnly={readOnly}
        isInt={isInt}
      />
    );
  }

  if (meta.viewOptions?.MinMaxRange) {
    return (
      <MinMaxRangeView
        value={value}
        setPropertyValue={setPropertyValue}
        additionalData={meta.additionalData}
        disabled={readOnly}
      />
    );
  }

  return (
    <VectorDefaultView
      disabled={readOnly}
      setPropertyValue={setPropertyValue}
      value={value}
      additionalData={meta.additionalData}
      isInt={isInt}
    />
  );
}
