export function computeTicks(start: number, end: number, interval: number) {
  const list: number[] = [];
  for (
    let t = Math.max(0, Math.floor(start / interval) * interval);
    t <= end;
    t += interval
  ) {
    list.push(t);
  }
  return list;
}
