import { isValidElement, ReactNode } from 'react';

/**
 * This utility function checks whether an unkown value is of type ReactNode, useful when
 * sending notifications from a try/catch
 */
export function isReactRenderable(value: unknown): value is ReactNode {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    value === null ||
    value === undefined ||
    Array.isArray(value) ||
    isValidElement(value)
  );
}
