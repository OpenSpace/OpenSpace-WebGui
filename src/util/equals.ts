export function lowPrecisionEqualMatrix(
  lhs: number[][] | undefined,
  rhs: number[][] | undefined
) {
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

export function equalArray<T>(lhs: T[] | undefined, rhs: T[] | undefined) {
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
) {
  if (lhs === undefined && rhs === undefined) {
    return true;
  }
  if (lhs === undefined || rhs === undefined) {
    return false;
  }
  if (lhs.length !== rhs.length) {
    return false;
  }

  return lhs?.every((value, i) => lowPrecisionEqual()(value, rhs[i]));
}

export function lowPrecisionEqual(epsilon: number = 1e-3) {
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
