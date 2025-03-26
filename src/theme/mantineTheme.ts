import {
  ActionIcon,
  alpha,
  Badge,
  Button,
  createTheme,
  defaultVariantColorsResolver,
  RangeSlider,
  Slider,
  ThemeIcon,
  Tooltip,
  VariantColorsResolver
} from '@mantine/core';

/**
 * This functions resolves colors for different variants, and adds new variants, for
 * Mantine components.
 *
 * https://mantine.dev/styles/variants-sizes/#variantcolorresolver
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  // Add new variants
  if (input.variant === 'menubar') {
    return {
      background: 'transparent',
      hover: alpha('var(--mantine-color-dark-2)', 0.5),
      color: 'var(--mantine-color-white)',
      border: 'none'
    };
  }

  return defaultResolvedColors;
};

/**
 * The theme object that will be used by the MantineProvider.
 */
export const theme = createTheme({
  cursorType: 'pointer',
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    Badge: Badge.extend({
      styles: {
        label: {
          textTransform: 'none'
        }
      }
    }),
    Button: Button.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    RangeSlider: RangeSlider.extend({
      styles: {
        mark: {
          backgroundColor: 'var(--mantine-color-gray-5)'
        },
        thumb: {
          backgroundColor: 'var(--mantine-color-gray-2)',
          outline: 'none',
          border: 'none'
        }
      }
    }),
    Slider: Slider.extend({
      styles: {
        mark: {
          backgroundColor: 'var(--mantine-color-gray-4)'
        },
        thumb: {
          backgroundColor: 'var(--mantine-color-gray-2)',
          outline: 'none',
          border: 'none'
        }
      }
    }),
    ThemeIcon: ThemeIcon.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        transitionProps: { duration: 400, enterDelay: 400 },
        position: 'top',
        maw: 300,
        multiline: true
      }
    })
  },
  headings: {
    sizes: {
      h1: { fontSize: '1.5rem' },
      h2: { fontSize: '1.25rem' },
      h3: { fontSize: '1.125rem' },
      h4: { fontSize: '1rem' },
      h5: { fontSize: '0.875rem' },
      h6: { fontSize: '0.75rem' }
    }
  },
  variantColorResolver
});
