import { scalePow } from 'd3';

export function useSliderScale(exponent: number, min: number, max: number) {
  const scale = scalePow().exponent(exponent).domain([min, max]).range([min, max]);
  const extent = max - min;

  const marks: number[] = [];

  // When no min/max is set, the marks for the slider cannot be nicely computed.
  // @TODO (2025-03-14, emmbr) This should maybe be handled in a better way, but for now
  // check that the extent is finite
  if (isFinite(extent)) {
    // Split the extent up into four equal pieces
    const nSteps = 4;
    const marksStep = extent / nSteps;
    for (let i = 0; i < nSteps; i++) {
      marks.push(min + i * marksStep);
    }
    marks.push(max);
  }

  const scaledMarks = marks.map((mark) => ({
    value: scale.invert(mark)
  }));

  function valueToSliderValue(value: number): number {
    return scale.invert(value);
  }

  function sliderValueToValue(sliderValue: number): number {
    return scale(sliderValue);
  }

  return { scale, scaledMarks, valueToSliderValue, sliderValueToValue };
}
