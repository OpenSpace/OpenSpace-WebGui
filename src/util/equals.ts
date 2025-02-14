export function customPrecisionEqualFunc(
  epsilon: number
): (lhs: number | undefined, rhs: number | undefined) => boolean {
  return (lhs: number | undefined, rhs: number | undefined) => {
    if (lhs === undefined && rhs === undefined) {
      return true;
    }
    if (lhs === undefined || rhs === undefined) {
      return false;
    }
    return Math.abs(lhs - rhs) < epsilon;
  };
}

export function lowPrecisionEqual(
  lhs: number | undefined,
  rhs: number | undefined
): boolean {
  return customPrecisionEqualFunc(1e-3)(lhs, rhs);
}

export function lowPrecisionEqualMatrix(
  lhs: number[][] | undefined,
  rhs: number[][] | undefined
): boolean {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }
  return lhs.every((value, i) => lowPrecisionEqualArray(value, rhs[i]));
}

export function equalArray<T>(lhs: T[] | undefined, rhs: T[] | undefined): boolean {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }
  return lhs.every((value, i) => value === rhs[i]);
}

export function lowPrecisionEqualArray(
  lhs: number[] | undefined,
  rhs: number[] | undefined
): boolean {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }

  return lhs?.every((value, i) => lowPrecisionEqual(value, rhs[i]));
}
