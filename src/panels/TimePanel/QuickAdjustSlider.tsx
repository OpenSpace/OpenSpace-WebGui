import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Slider, Text } from '@mantine/core';

interface Props {
  onChange: (value: number) => void;
  onEnd: () => void;
}

export function QuickAdjustSlider({ onChange, onEnd }: Props) {
  const [sliderValue, setSliderValue] = useState(0);
  const { t } = useTranslation('panel-time');

  const sliderMax = 10;
  const percentagePerStep = 100 / (sliderMax * 2);
  const sliderWidth = `${Math.abs(sliderValue * percentagePerStep)}%`;

  function onInput(value: number) {
    onChange(value);
    setSliderValue(value);
  }

  return (
    <>
      <Group justify={'space-between'}>
        <Text size={'md'} c={'dimmed'}>
          -
        </Text>
        <Text size={'md'} c={'dimmed'}>
          {t('quick-adjust.title')}
        </Text>
        <Text size={'md'} c={'dimmed'}>
          +
        </Text>
      </Group>
      <Slider
        mb={'xl'}
        min={-sliderMax}
        max={sliderMax}
        onChange={onInput}
        onChangeEnd={() => {
          // Reset the slider back to middle and set the deltaTime to whatever it was
          // before we started adjusting
          setSliderValue(0);
          onEnd();
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
    </>
  );
}
