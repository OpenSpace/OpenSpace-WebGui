interface Props {
  xPos: number;
  height: number;
}

export function Playhead({ xPos, height }: Props) {
  return (
    <g>
      <circle
        cx={xPos}
        cy={10}
        r={10}
        fill="#009dffff"
        // cursor={draggingPlayHead ? 'grabbing' : 'grab'}
      />
      <rect
        x={xPos - 1}
        y={0}
        width={2}
        height={height}
        fill="#009dffff"
        // cursor={draggingPlayHead ? 'grabbing' : 'grab'}
      />
    </g>
  );
}
