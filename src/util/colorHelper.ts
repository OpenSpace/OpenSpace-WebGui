import { convertHsvaTo, parseColor, RGBA } from '@mantine/core';
import { ColorFormat } from 'node_modules/@mantine/core/lib/components/ColorPicker/ColorPicker.types';

// OpenSpace colors are defined as an object with r, g, b, and a (optional) properties,
// with values in the range [0, 1]
export type OpenSpaceColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export function openspaceColorToRgba(color: OpenSpaceColor): RGBA {
  return {
    r: Math.round(255 * color.r),
    g: Math.round(255 * color.g),
    b: Math.round(255 * color.b),
    a: color.a === undefined ? 1.0 : color.a
  };
}

export function openspaceColorToColor(color: OpenSpaceColor): string {
  const r = Math.round(255 * color.r);
  const g = Math.round(255 * color.g);
  const b = Math.round(255 * color.b);
  return color.a !== undefined
    ? `rgba(${r}, ${g}, ${b}, ${color.a})`
    : `rgb(${r}, ${g}, ${b})`;
}

export function rgbaToColor(color: RGBA, useAlpha: boolean): string {
  return useAlpha
    ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    : `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function toOpenspaceColor(color: RGBA, useAlpha: boolean): OpenSpaceColor {
  return {
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255,
    a: useAlpha ? color.a : undefined
  };
}

export function rgbaToFormat(color: RGBA, format: ColorFormat): string {
  const rgbaColor: string = rgbaToColor(color, true);
  const hsva = parseColor(rgbaColor);
  return convertHsvaTo(format, hsva);
}

export function toFormat(color: string, format: ColorFormat): string {
  const hsva = parseColor(color);
  return convertHsvaTo(format, hsva);
}
