interface Props {
  time: number;
  xPos: number;
  height: number;
}
export function Tick({ time, xPos, height }: Props) {
  return (
    <g>
      <line x1={xPos} y1={0} x2={xPos} y2={height - 20} stroke="#cccccc80" />
      <text x={xPos} y={height - 5} textAnchor="middle" fill="#ccc">
        {time}s
      </text>
    </g>
  );
}
