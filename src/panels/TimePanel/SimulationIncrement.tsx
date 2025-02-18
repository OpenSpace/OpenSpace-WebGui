import { useRef, useState } from 'react';
import { Group, Select } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useAppSelector } from '@/redux/hooks';

import { DeltaTimeStepsControl } from './DeltaTimeStepControl';
import { QuickAdjustSlider } from './QuickAdjustSlider';
import { Decimals, StepSizes, TimePart } from './types';

export function SimulationIncrement() {
  const updateDeltaTime = useThrottledCallback(updateDeltaTimeNow, 50);
  const [stepSize, setStepSize] = useState<TimePart>(TimePart.Seconds);

  const luaApi = useOpenSpaceApi();
  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime) ?? 1;

  // We use a ref for the delta time to avoid stale closure in the `setDeltaTime` callback
  const deltaTimeRef = useRef(targetDeltaTime);
  deltaTimeRef.current = targetDeltaTime;

  // Remove Milliseconds as an option to select
  const selectableData = Object.values(TimePart).filter(
    (value) => value !== TimePart.Milliseconds
  );

  function updateDeltaTimeNow(value: number) {
    luaApi?.time.interpolateDeltaTime(value);
  }

  function setDeltaTime(value: number, relative: boolean) {
    const deltaTime = value * StepSizes[stepSize];
    const newDeltaTime = relative ? deltaTimeRef.current + deltaTime : deltaTime;

    updateDeltaTime(newDeltaTime);
  }

  function onQuickAdjust(value: number) {
    const quickAdjust = StepSizes[stepSize] * value ** 5;
    updateDeltaTime(targetDeltaTime + quickAdjust);
  }

  return (
    <>
      <Group grow mb={'xs'}>
        <Select
          label={'Display Unit'}
          value={stepSize}
          data={selectableData}
          allowDeselect={false}
          onChange={(value) => setStepSize(value! as TimePart)}
        />
        <NumericInput
          label={`${stepSize} / second`}
          value={targetDeltaTime / StepSizes[stepSize]}
          onEnter={(newValue) => setDeltaTime(newValue, false)}
          step={1}
          decimalScale={Decimals[stepSize]}
        />
      </Group>
      <QuickAdjustSlider
        onChange={onQuickAdjust}
        onEnd={() => updateDeltaTime(targetDeltaTime)}
      />
      <DeltaTimeStepsControl stepSize={stepSize} />
    </>
  );
}
