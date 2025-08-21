import { isCameraEntry, KeyframeEntry } from './types';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  keyframeInfo: KeyframeEntry;
  cursor: string;
  opacity?: number;
  onMouseDown?: (event: React.MouseEvent, keyframe: KeyframeEntry) => void;
}

export function Keyframe({
  x,
  y,
  width,
  height,
  isSelected,
  keyframeInfo,
  cursor,
  opacity = 1.0,
  onMouseDown
}: Props) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={isCameraEntry(keyframeInfo) ? 'blue' : 'green'}
      strokeWidth={2}
      stroke={isSelected ? 'white' : 'none'}
      cursor={cursor}
      opacity={opacity}
      onMouseDown={(event) => {
        onMouseDown?.(event, keyframeInfo);
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
