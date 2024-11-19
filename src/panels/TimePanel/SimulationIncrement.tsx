import { useRef, useState } from 'react';
import { Group, Select, Slider, Text } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { TimePart } from '@/types/enums';

import { DeltaTimeStepsControl } from './DeltaTimeStepControl';
import { InlineInput } from './InlineInput';
import { Decimals, StepSizes } from './util';

export function SimulationIncrement() {
  const updateDeltaTime = useThrottledCallback(updateDeltaTimeNow, 50);
  const [stepSize, setStepSize] = useState<TimePart>(TimePart.Seconds);
  const [beforeQuickAdjust, setBeforeQuickAdjust] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);

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

  function setQuickAdjust(value: number) {
    // Store the current deltaTime, because of capture this value will be the same as long
    // as the first time user pressed the slider
    setBeforeQuickAdjust(targetDeltaTime);

    const quickAdjust = StepSizes[stepSize] * value ** 5;
    updateDeltaTime(quickAdjust);

    setSliderValue(value);
  }

  const marks = [
    { value: -10, label: '-' },
    { value: -8 },
    { value: -6 },
    { value: -4 },
    { value: -2 },
    { value: 2 },
    { value: 4 },
    { value: 6 },
    { value: 8 },
    { value: 10, label: '+' }
  ];

  return (
    <>
      <Group grow>
        <Select
          label={'Display Unit'}
          value={stepSize}
          data={selectableData}
          allowDeselect={false}
          onChange={(value) => setStepSize(value! as TimePart)}
        />
        <InlineInput
          label={`${stepSize} / second`}
          value={targetDeltaTime / StepSizes[stepSize]}
          onInputChange={setDeltaTime}
          step={1}
          decimalScale={Decimals[stepSize]}
        />
      </Group>
      <Text size={'md'} ta={'center'} c={'dimmed'} mt={'xs'}>
        {'Quick Adjust\r'}
      </Text>
      <Slider
        size={'lg'}
        mb={'xl'}
        min={-10}
        max={10}
        onChange={setQuickAdjust}
        onChangeEnd={() => {
          // Reset the slider back to middle and set the deltaTime to whatever it was
          // before we started adjusting
          setSliderValue(0);
          updateDeltaTime(beforeQuickAdjust);
        }}
        label={null}
        step={0.05}
        value={sliderValue}
        marks={marks}
      />
      <DeltaTimeStepsControl stepSize={stepSize} />
    </>
  );
}
