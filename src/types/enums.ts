// Collection of enums that in theory should be defined in a .tsx file, however this
// causes issues with fast refresh: https://nextjs.org/docs/architecture/fast-refresh

export enum IconSize {
  xs = 16,
  sm = 20,
  md = 26,
  lg = 32,
  xl = 42
}
export enum NavigationType {
  jump = 1,
  fly = 2,
  focus = 3,
  frame = 4
}
