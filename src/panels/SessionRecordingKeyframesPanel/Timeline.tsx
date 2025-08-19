import { isCameraEntry, KeyframeEntry } from './types';
import { Tick } from './Tick';
import { useState } from 'react';
import { Playhead } from './Playhead';

interface Props {
  keyframes: KeyframeEntry[];
  tickInterval?: number;
  selectedKeyframe: KeyframeEntry | undefined;
  onMove: (id: number, newTime: number) => void;
  onSelect: (keyframe: KeyframeEntry) => void;
}

export function Timeline({
  keyframes,
  tickInterval = 5,
  selectedKeyframe,
  onMove,
  onSelect
}: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; time: number } | null>(
    null
  );
  const [playHeadTime, setPlayHeadTime] = useState(0);
  const [draggingPlayHead, setDraggingPlayHead] = useState(false);
  // State to keep track if we need to make an update or not - avoids updating data if
  // we only selected a keyframe
  const [keyframeInitialTime, setKeyframeInitialTime] = useState<number | null>(null);

  // Svg sizes
  const width = 800;
  const height = 200;
  const totalDuration = Math.max(...keyframes.map((k) => k.Timestamp), 60);

  const ticks: number[] = [];
  for (let t = 0; t <= totalDuration; t += tickInterval) {
    ticks.push(t);
  }

  function toXPos(t: number) {
    return (t / totalDuration) * width;
  }

  function toTime(x: number) {
    return (x / width) * totalDuration;
  }

  function onKeyframeStartDrag(index: number, startX: number) {
    onSelect(keyframes[index]);
    setKeyframeInitialTime(keyframes[index].Timestamp);
    setDraggingId(index);
    setTooltip({ x: startX, y: height / 2 - 15, time: keyframes[index].Timestamp });
  }

  function onKeyframeDragMove(clientX: number) {
    if (draggingId === null) {
      return;
    }

    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    setTooltip({ x: toXPos(newTime), y: height / 2 - 15, time: newTime });
  }

  function onKeyframeDragEnd() {
    if (
      draggingId !== null &&
      tooltip !== null &&
      keyframeInitialTime !== tooltip.time // Only update if we actually moved
    ) {
      onMove(draggingId, tooltip.time);
    }

    setDraggingId(null);
    setTooltip(null);
  }

  function onPlayheadStartDrag(clientX: number) {
    if (draggingId !== null) {
      return;
    }
    setDraggingPlayHead(true);
    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    setPlayHeadTime(newTime);
    setTooltip({ x: clientX, y: height / 2 - 15, time: newTime });
  }

  function onPlayheadDragMove(clientX: number) {
    if (!draggingPlayHead) {
      return;
    }
    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    setPlayHeadTime(newTime);
    setTooltip({ x: clientX, y: height / 2 - 15, time: newTime });
  }

  function onPlayheadDragEnd() {
    setDraggingPlayHead(false);
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid #ccc', background: '#fafafa20' }}
      onMouseUp={() => {
        onKeyframeDragEnd();
        onPlayheadDragEnd();
      }}
      onMouseLeave={() => {
        onKeyframeDragEnd();
        onPlayheadDragEnd();
      }}
      onMouseMove={(event) => {
        onKeyframeDragMove(event.nativeEvent.offsetX);
        onPlayheadDragMove(event.nativeEvent.offsetX);
      }}
      onMouseDown={(event) => onPlayheadStartDrag(event.nativeEvent.offsetX)}
      cursor={draggingPlayHead || draggingId !== null ? 'grabbing' : 'default'}
    >
      {ticks.map((t) => {
        return <Tick key={t} time={t} xPos={toXPos(t)} height={height} />;
      })}

      <Playhead xPos={toXPos(playHeadTime)} height={height} />

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
            strokeWidth={2}
            stroke={kf.Id === selectedKeyframe?.Id ? 'white' : 'none'}
            cursor={draggingId !== null ? 'grabbing' : 'grab'}
            onMouseDown={(event) => {
              onKeyframeStartDrag(index, event.nativeEvent.offsetX);
              event.stopPropagation();
            }}
          />
        );
      })}

      {tooltip && (
        <g>
          {draggingId !== null ? (
            <>
              <rect
                x={tooltip.x - 10}
                y={height / 2 - 10}
                width={20}
                height={20}
                opacity={0.6}
                fill={isCameraEntry(keyframes[draggingId]) ? 'blue' : 'green'}
                cursor={draggingId !== null ? 'grabbing' : 'grab'}
              />
              <text x={tooltip.x} y={tooltip.y} fill={'white'} textAnchor="middle">
                {tooltip.time.toFixed(2)}s
              </text>
            </>
          ) : (
            <text x={tooltip.x + 2} y={tooltip.y} fill={'white'}>
              {tooltip.time.toFixed(2)}s
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
