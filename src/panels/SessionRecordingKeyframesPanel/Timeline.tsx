import { isCameraEntry, KeyframeEntry } from './types';
import { Tick } from './Tick';
import { useState } from 'react';

interface Props {
  keyframes: KeyframeEntry[];
  tickInterval?: number;
  onMove: (id: number, newTime: number) => void;
}

export function Timeline({ keyframes, tickInterval = 5, onMove }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; time: number } | null>(
    null
  );
  const totalDuration = Math.max(...keyframes.map((k) => k.Timestamp), 60);

  const ticks: number[] = [];
  for (let t = 0; t <= totalDuration; t += tickInterval) {
    ticks.push(t);
  }

  const width = 800;
  const height = 200;

  function toXPos(t: number) {
    return (t / totalDuration) * width;
  }

  function toTime(x: number) {
    return (x / width) * totalDuration;
  }

  function onStartDrag(index: number, startX: number) {
    setDraggingId(index);
    setTooltip({ x: startX, y: height / 2 - 15, time: keyframes[index].Timestamp });
  }

  function onDragMove(clientX: number) {
    if (draggingId === null) {
      return;
    }

    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    setTooltip({ x: toXPos(newTime), y: height / 2 - 15, time: newTime });
  }

  function onDragEnd() {
    if (draggingId !== null && tooltip !== null) {
      onMove(draggingId, tooltip.time);
    }

    setDraggingId(null);
    setTooltip(null);
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid #ccc', background: '#fafafa20' }}
      onMouseLeave={onDragEnd}
      onMouseUp={onDragEnd}
      onMouseMove={(event) => onDragMove(event.nativeEvent.offsetX)}
    >
      {ticks.map((t) => {
        return <Tick key={t} time={t} xPos={toXPos(t)} height={height} />;
      })}

      {keyframes.map((kf, index) => {
        const size = 20;
        return (
          <rect
            key={kf.Timestamp}
            x={toXPos(kf.Timestamp) - size / 2}
            y={height / 2 - size / 2}
            width={size}
            height={size}
            fill={isCameraEntry(kf) ? 'blue' : 'green'}
            onMouseDown={(event) => {
              event.preventDefault();
              onStartDrag(index, event.nativeEvent.offsetX);
            }}
          />
        );
      })}

      {tooltip && draggingId && (
        <g>
          <rect
            x={tooltip.x - 10}
            y={height / 2 - 10}
            width={20}
            height={20}
            opacity={0.7}
            fill={isCameraEntry(keyframes[draggingId]) ? 'blue' : 'green'}
          />
          <text x={tooltip.x} y={tooltip.y} fill={'white'} textAnchor="middle">
            {tooltip.time.toFixed(2)}s
          </text>
        </g>
      )}
    </svg>
  );
}
