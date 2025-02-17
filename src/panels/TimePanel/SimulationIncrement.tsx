import { useRef, useState } from 'react';
import { Group, Select, Slider, Text } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { DeltaTimeStepsControl } from './DeltaTimeStepControl';
import { TimeIncrementInput } from './TimeIncrementInput';
import { Decimals, StepSizes, TimePart } from './types';

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

  const sliderMax = 10;
  const percentagePerStep = 100 / (sliderMax * 2);
  const sliderWidth = `${Math.abs(sliderValue * percentagePerStep)}%`;

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
        <TimeIncrementInput
          label={`${stepSize} / second`}
          value={targetDeltaTime / StepSizes[stepSize]}
          onInputChange={setDeltaTime}
          step={1}
          decimalScale={Decimals[stepSize]}
          wrapStepControlButtons={false}
        />
      </Group>
      <Group mt={'xs'} justify={'space-between'}>
        <Text size={'md'} c={'dimmed'}>
          -
        </Text>
        <Text size={'md'} c={'dimmed'}>
          Quick Adjust
        </Text>
        <Text size={'md'} c={'dimmed'}>
          +
        </Text>
      </Group>
      <Slider
        mb={'xl'}
        min={-sliderMax}
        max={sliderMax}
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
        marks={[{ value: 0 }]}
        // Make the bar start from the center
        styles={{
          bar: {
            left: sliderValue > 0 ? '50%' : `calc(50% - ${sliderWidth})`,
            width: `${sliderWidth}`
          }
        }}
      />
      <DeltaTimeStepsControl stepSize={stepSize} />
    </>
  );
}
