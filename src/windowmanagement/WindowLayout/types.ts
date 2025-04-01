export type FloatWindowPosition = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type WindowLayoutPosition = 'left' | 'right' | 'float' | 'top';

export interface WindowLayoutOptions {
  title: string;
  id: string;
  position?: WindowLayoutPosition;
  floatPosition?: FloatWindowPosition;
}
