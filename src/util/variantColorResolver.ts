import {
  alpha,
  defaultVariantColorsResolver,
  VariantColorsResolver
} from '@mantine/core';

/**
 * This functions resolves colors for different variants, and adds new variants, for
 * Mantine components.
 *
 * https://mantine.dev/styles/variants-sizes/#variantcolorresolver
 */
export const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  // Add new variants
  if (input.variant === 'taskbar') {
    return {
      background: 'transparent',
      hover: alpha('var(--mantine-color-dark-2)', 0.5),
      color: 'var(--mantine-color-white)',
      border: 'none'
    };
  }

  return defaultResolvedColors;
};
