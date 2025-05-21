// @TODO (2025-03-03, emmbr) This should be handled a better way... This is a bit of a
// hack and the max value is just arbitrarily chosen
const maxAllowedExtentForSlider = 1e12;

/**
 * Determines whether the given slider extent is valid based on the provided minimum and
 * maximum values.
 *
 * @param {number} min - The minimum value of the slider.
 * @param {number} max - The maximum value of the slider.
 *
 * @returns {boolean} Returns `true` if the extent (difference between max and min) is
 * finite and less than the allowed maximum extent for the slider; otherwise, returns
 * `false`.
 */
export function validSliderExtent(min: number, max: number) {
  const extent = max - min;
  // When no min/max is set, the marks for the slider cannot be nicely computed
  return isFinite(extent) && extent < maxAllowedExtentForSlider;
}
