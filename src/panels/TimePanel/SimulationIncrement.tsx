import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Select } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useAppSelector } from '@/redux/hooks';

import { DeltaTimeStepsControl } from './DeltaTimeStepControl';
import { QuickAdjustSlider } from './QuickAdjustSlider';
import { Decimals, StepSizes, TimePart } from './types';

export function SimulationIncrement() {
  const luaApi = useOpenSpaceApi();
  const [stepSize, setStepSize] = useState<TimePart>(TimePart.Seconds);

  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime) ?? 1;
  const updateDeltaTime = useThrottledCallback(updateDeltaTimeNow, 50);
  const { t } = useTranslation('panel-time');

  // Remove Milliseconds as an option to select
  const selectableData = Object.values(TimePart)
    .filter((value) => value !== TimePart.Milliseconds)
    .map((unit) => {
      return {
        value: unit,
        label: t(`time-parts.${unit}_other`)
      };
    });

  function updateDeltaTimeNow(value: number) {
    luaApi?.time.interpolateDeltaTime(value);
  }

  function setDeltaTime(value: number) {
    const deltaTime = value * StepSizes[stepSize];

    updateDeltaTime(deltaTime);
  }

  function onQuickAdjust(value: number) {
    const quickAdjust = StepSizes[stepSize] * value ** 5;
    updateDeltaTime(targetDeltaTime + quickAdjust);
  }

  return (
    <>
      <Group grow mb={'xs'}>
        <Select
          label={t('simulation-increment.select-unit-label')}
          value={stepSize}
          data={selectableData}
          allowDeselect={false}
          onChange={(value) => setStepSize(value! as TimePart)}
        />
        <NumericInput
          label={`${t(`time-parts.${stepSize}`, {
            count: targetDeltaTime / StepSizes[stepSize]
          })} / ${t('time-parts.Seconds_one').toLocaleLowerCase()}`}
          value={targetDeltaTime / StepSizes[stepSize]}
          onEnter={(newValue) => setDeltaTime(newValue)}
          step={1}
          decimalScale={Decimals[stepSize]}
        />
      </Group>
      <QuickAdjustSlider
        onChange={onQuickAdjust}
        onEnd={() => updateDeltaTime(targetDeltaTime)}
      />
      <DeltaTimeStepsControl />
    </>
  );
}
