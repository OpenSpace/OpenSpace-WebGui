import { AnyProperty } from 'openspace-api-js/types';

import { stripRoot } from '@/panels/AssetsPanel/util';

import { COMMAND_TYPES, CommandType, OsTest, TestCommand, Vec3 } from './types';

/**
 * @param path The absolute path to an asset file
 * @param root The absolute path to the folder the asset name should be relative to
 * @returns The asset name used in test commands: the path relative to `root`, without
 * the asset file extension
 */
export function assetNameFromPath(path: string, root: string): string {
  return stripRoot(path, root).replace(/\.j?asset$/, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPropertyValue(value: unknown): value is AnyProperty['value'] {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (Array.isArray(value) &&
      value.every((item) => typeof item === 'string' || typeof item === 'number'))
  );
}

function isTestCommand(command: unknown): command is TestCommand {
  if (!isRecord(command)) {
    return false;
  }
  const { type, value } = command;
  switch (type) {
    case 'screenshot':
      return true;
    case 'wait':
    case 'deltatime':
      return typeof value === 'number';
    case 'pause':
      return typeof value === 'boolean';
    case 'script':
    case 'time':
    case 'asset':
    case 'action':
      return typeof value === 'string';
    case 'property':
      return (
        isRecord(value) &&
        typeof value.property === 'string' &&
        isPropertyValue(value.value)
      );
    case 'navigationstate':
      return (
        isRecord(value) &&
        typeof value.anchor === 'string' &&
        Array.isArray(value.position)
      );
    default:
      return false;
  }
}

export function isOsTest(test: unknown): test is OsTest {
  return (
    isRecord(test) &&
    (test.profile === undefined || typeof test.profile === 'string') &&
    Array.isArray(test.commands) &&
    test.commands.every(isTestCommand)
  );
}

export function isCommandType(value: string): value is CommandType {
  return (COMMAND_TYPES as readonly string[]).includes(value);
}

/**
 * @param s A string of three comma-separated numbers, e.g. `'0, 1, 2'`
 * @returns The parsed vector, or `null` if the string is not a valid vector
 */
export function parseVec3(s: string): Vec3 | null {
  const parts = s.split(',').map((part) => Number(part.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }
  const [x, y, z] = parts;
  if (x === undefined || y === undefined || z === undefined) {
    return null;
  }
  return [x, y, z];
}
