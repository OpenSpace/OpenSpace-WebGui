import { scalePow } from 'd3';

export function useSliderScale(exponent: number, min: number, max: number) {
  const scale = scalePow().exponent(exponent).domain([min, max]).range([min, max]);
  const extent = max - min;

  // Split the extent up into four equal pieces
  const marksStep = extent / 4;

  // When no min/max is set, the marks for the slider cannot be nicely computed
  const marks = !isFinite(extent)
    ? []
    : [
        {
          value: min
        },
        { value: min + 1 * marksStep },
        {
          value: min + extent / 2
        },
        { value: min + 3 * marksStep },
        {
          value: max
        }
      ];

  const scaledMarks = marks.map((mark) => ({
    value: scale.invert(mark.value)
  }));

  function valueToSliderValue(value: number): number {
    return scale.invert(value);
  }

  function sliderValueToValue(sliderValue: number): number {
    return scale(sliderValue);
  }

  return { scale, scaledMarks, valueToSliderValue, sliderValueToValue };
}
