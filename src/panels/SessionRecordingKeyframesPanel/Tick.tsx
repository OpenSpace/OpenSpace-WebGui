interface Props {
  time: number;
  xPos: number;
}
export function Tick({ time, xPos }: Props) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: `${xPos}%`,
          top: 0,
          bottom: 20,
          border: '1px solid #cccccc80'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${xPos}%`,
          bottom: 0,
          transform: 'translateX(-50%)'
        }}
      >
        {time}s
      </div>
    </>
  );
}
