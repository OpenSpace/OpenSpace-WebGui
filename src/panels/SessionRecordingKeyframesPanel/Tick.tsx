interface Props {
  time: number;
  xPos: number;
  height: number;
}
export function Tick({ time, xPos, height }: Props) {
  return (
    <g>
      <line x1={xPos} y1={20} x2={xPos} y2={height} stroke={"#cccccc80"} />
      <text x={xPos} y={15} textAnchor={"middle"} fill={"#ccc"} fontSize={14}>
        {time}s
      </text>
    </g>
  );
}
