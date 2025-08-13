import { Box } from '@mantine/core';
import { isCameraEntry, KeyframeEntry } from './types';
import { Tick } from './Tick';

interface Props {
  keyframes: KeyframeEntry[];
  tickInterval?: number;
  onMove: (id: number, newTime: number) => void;
}

export function Timeline({ keyframes, tickInterval = 5, onMove }: Props) {
  const totalDuration = Math.max(...keyframes.map((k) => k.Timestamp), 60);

  const ticks: number[] = [];
  for (let t = 0; t <= totalDuration; t += tickInterval) {
    ticks.push(t);
  }

  return (
    <Box
      mx={'xs'}
      style={{ position: 'relative', height: 200, border: '1px solid #ccc' }}
    >
      {ticks.map((t) => {
        const left = (t / totalDuration) * 100;

        return <Tick key={t} time={t} xPos={left} />;
      })}

      {keyframes.map((kf, index) => {
        const left = (kf.Timestamp / totalDuration) * 100;

        return (
          <div
            key={kf.Timestamp}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: isCameraEntry(kf) ? 'blue' : 'green',
              width: 20,
              height: 20
            }}
            draggable={true}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', index.toString());
              console.log(index);
            }}
            onDragEnd={(event) => {
              const rect = (
                event.target as HTMLDivElement
              ).parentElement!.getBoundingClientRect();
              const newLeftRatio = (event.clientX - rect.left) / rect.width;
              const newTimestamp = newLeftRatio * totalDuration;
              onMove(index, newTimestamp);
              console.log(event);
            }}
          ></div>
        );
      })}
    </Box>
  );
}
