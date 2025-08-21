import { isCameraEntry, KeyframeEntry } from './types';
import { Tick } from './Tick';
import { useState } from 'react';
import { Playhead } from './Playhead';
import { Keyframe } from './Keyframe';

interface Props {
  keyframes: KeyframeEntry[];
  tickInterval?: number;
  selectedKeyframeIDs: number[];
  playheadTime: number;

  onSelectKeyframes: (ids: number[], isAdditive: boolean) => void;
  onMoveKeyframes: (ids: number[], delta: number) => void;
  onPlayheadChange: (time: number) => void;
}

export function Timeline({
  keyframes,
  tickInterval = 5,
  selectedKeyframeIDs,
  playheadTime,
  onSelectKeyframes,
  onMoveKeyframes,
  onPlayheadChange
}: Props) {
  const [draggingIds, setDraggingIds] = useState<number[] | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const [tooltip, setTooltip] = useState<{ x: number; y: number; time: number } | null>(
    null
  );

  const [draggingPlayhead, setDraggingPlayhead] = useState(false);

  // Svg sizes
  const width = 800;
  const rowHeight = 80;
  const axisHeight = 50;
  const height = axisHeight + rowHeight;
  const keyframeHeight = 20;
  const keyframeWidth = 20;
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

  function toYPos(index: number) {
    const yBase = rowHeight * index;
    return axisHeight + yBase + rowHeight / 2;
  }

  function onKeyframeMouseDown(event: React.MouseEvent, kf: KeyframeEntry) {
    event.stopPropagation();

    const isAdditive = event.ctrlKey || event.metaKey;
    // Update selection
    onSelectKeyframes([kf.Id], isAdditive);

    if (isAdditive) {
      setDraggingIds(
        selectedKeyframeIDs.includes(kf.Id)
          ? selectedKeyframeIDs
          : [...selectedKeyframeIDs, kf.Id]
      );
    } else {
      setDraggingIds([kf.Id]);
    }

    const startXPos = toXPos(kf.Timestamp);
    setDragStartX(startXPos);
    setTooltip({
      x: startXPos,
      y: toYPos(0) - keyframeHeight,
      time: kf.Timestamp
    });
  }

  function onMouseMove(event: React.MouseEvent) {
    const clientX = event.nativeEvent.offsetX;
    const clientY = event.nativeEvent.offsetY;

    // If we're dragging the playhead in the axis area
    if (draggingPlayhead && clientY <= axisHeight) {
      const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
      onPlayheadChange(newTime);
      setTooltip({ x: clientX + 25, y: axisHeight - 10, time: newTime });
      return;
    }

    if (!draggingIds || dragStartX === null) {
      return;
    }

    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    const clampedXPos = toXPos(newTime);
    setTooltip({ x: clampedXPos, y: toYPos(0) - keyframeHeight, time: newTime });
  }

  function onMouseUp() {
    // Update keyframes if they were moved
    if (draggingIds && dragStartX !== null && tooltip !== null) {
      const startTime = toTime(dragStartX);
      const newTime = tooltip.time;

      const delta = newTime - startTime;
      if (Math.abs(delta) > 0.01) {
        onMoveKeyframes(draggingIds, delta);
      }
    }

    setDraggingIds(null);
    setTooltip(null);
    setDragStartX(null);
    setDraggingPlayhead(false);
  }

  function onBackgroundClick() {
    onSelectKeyframes([], false);
    setDraggingIds(null);
  }

  function onAxisMouseDown(event: React.MouseEvent) {
    const clientX = event.nativeEvent.offsetX;
    const newTime = Math.max(0, Math.min(totalDuration, toTime(clientX)));
    setTooltip({ x: clientX + 25, y: axisHeight - 10, time: newTime });
    setDraggingPlayhead(true);
    onPlayheadChange(newTime);
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid #ccc', background: '#fafafa20' }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseDown={onBackgroundClick}
      cursor={draggingPlayhead ? 'grabbing' : 'default'}
    >
      <g onMouseDown={onAxisMouseDown} cursor={draggingPlayhead ? 'grabbing' : 'grab'}>
        <rect x={0} y={0} width={width} height={axisHeight} fill="#fafafa20" />
        {ticks.map((t) => {
          return <Tick key={t} time={t} xPos={toXPos(t)} height={axisHeight} />;
        })}
      </g>

      {keyframes.map((kf) => {
        return (
          <Keyframe
            key={kf.Id}
            x={toXPos(kf.Timestamp) - keyframeWidth / 2}
            y={toYPos(0) - keyframeHeight / 2}
            width={keyframeWidth}
            height={keyframeHeight}
            isSelected={selectedKeyframeIDs.includes(kf.Id)}
            cursor={draggingIds !== null ? 'grabbing' : 'grab'}
            keyframeInfo={kf}
            onMouseDown={onKeyframeMouseDown}
          />
        );
      })}

      {tooltip && (
        <g>
          {draggingIds &&
            draggingIds.map((id) => {
              const kf = keyframes.find((kf) => kf.Id === id);
              if (!kf) {
                return null;
              }

              const delta = tooltip.time - toTime(dragStartX!);

              return (
                <Keyframe
                  key={id}
                  x={toXPos(kf.Timestamp + delta) - keyframeWidth / 2}
                  y={toYPos(0) - keyframeHeight / 2}
                  width={keyframeWidth}
                  height={keyframeHeight}
                  opacity={0.5}
                  cursor={draggingIds !== null ? 'grabbing' : 'grab'}
                  isSelected={false}
                  keyframeInfo={kf}
                />
              );
            })}

          <text x={tooltip.x} y={tooltip.y} fill={'white'} textAnchor="middle">
            {tooltip.time.toFixed(2)}s
          </text>
        </g>
      )}

      <Playhead xPos={toXPos(playheadTime)} height={height} />
    </svg>
  );
}
