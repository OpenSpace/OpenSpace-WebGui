import { convertHsvaTo, parseColor, RGBA } from '@mantine/core';
import { ColorFormat } from 'node_modules/@mantine/core/lib/components/ColorPicker/ColorPicker.types';

// OpenSpace colors are defined as an object with r, g, b, and a (optional) properties,
// with values in the range [0, 1]
export type OpenSpaceColor = number[];

export function openspaceColorToRgba(color: OpenSpaceColor): RGBA {
  return {
    r: Math.round(255 * color[0]),
    g: Math.round(255 * color[1]),
    b: Math.round(255 * color[2]),
    a: color[3] === undefined ? 1.0 : color[3]
  };
}

export function openspaceColorToColor([r, g, b, a]: OpenSpaceColor): string {
  const [red, green, blue] = [r, g, b].map((c) => Math.round(c * 255));

  return a !== undefined
    ? `rgba(${red}, ${green}, ${blue}, ${a})`
    : `rgb(${red}, ${green}, ${blue})`;
}

export function rgbaToColor(color: RGBA, useAlpha: boolean): string {
  return useAlpha
    ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    : `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function toOpenspaceColor(color: RGBA, useAlpha: boolean): OpenSpaceColor {
  return [color.r / 255, color.g / 255, color.b / 255].concat(useAlpha ? [color.a] : []);
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

export function rgbStringToRgba(color: string): RGBA {
  const [r, g, b, a] = color
    .replace(/[^0-9,./]/g, '')
    .split(/[/,]/)
    .map(Number);
  return { r, g, b, a: a === undefined ? 1 : a };
}
