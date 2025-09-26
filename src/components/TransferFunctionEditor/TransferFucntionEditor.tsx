import { useEffect, useRef } from 'react';
import { Histogram } from './Histogram';
import { TFKey } from './types';
import * as d3 from 'd3';

const HistogramData = [
  5, 5, 6, 7, 10, 20, 20, 15, 11, 12, 19, 7, 5, 6, 8, 9, 10, 11, 13, 15, 17, 19, 20, 19,
  14, 13, 12, 11, 10, 9, 8, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 18,
  16, 14, 12, 10, 8, 6, 5, 5, 6, 7, 8, 9, 17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 13, 12,
  11, 10, 9, 8, 7, 6, 5, 14, 15, 15, 16, 13, 14, 15, 17, 14, 15, 15, 16, 13, 14, 15, 17,
  14, 15, 15, 16, 13, 14, 15, 17, 5, 6, 7, 8, 6, 25, 30, 21, 22, 23, 30, 30, 3, 2, 25, 25,
  25, 25, 25, 29, 29, 30, 0
];

const Keys: TFKey[] = [
  { id: 'key1', scalar: 0.0, alpha: 0.0, color: '#000000' },
  { id: 'key2', scalar: 0.25, alpha: 0.25, color: '#ff0000' },
  { id: 'key3', scalar: 0.5, alpha: 0.5, color: '#00ff00' },
  { id: 'key4', scalar: 0.75, alpha: 0.75, color: '#0000ff' },
  { id: 'key4', scalar: 0.85, alpha: 0.3, color: '#0000ff' },
  { id: 'key5', scalar: 1.0, alpha: 1.0, color: '#ffffff' }
];

export function TransferFunctionEditor() {
  const alphaAxisRef = useRef<SVGGElement | null>(null);

  // TODO: set based on panel size ?
  const width = 700;
  const height = 500;

  // Plot area settings
  const padding = { top: 15, right: 25, bottom: 20, left: 25 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  // Opacity gradient settings
  const opacityGradientOffset = 20;
  const oacityGradientWidth = 10;

  const scalarToX = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
  const alphaToY = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

  useEffect(() => {
    if (alphaAxisRef.current) {
      const axis = d3.axisRight(alphaToY).ticks(3).tickSizeOuter(0);
      d3.select(alphaAxisRef.current).call(axis);
    }
  }, [alphaToY]);

  return (
    <svg width={width} height={height} style={{ background: '#3f3d3de1' }}>
      <defs>
        <linearGradient id="alphaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>

        <clipPath id="plotAreaClip">
          <rect x={0} y={0} width={innerWidth} height={innerHeight} />
        </clipPath>
      </defs>

      {/* Alpha gradient right axis */}
      <rect
        x={width - padding.right + oacityGradientWidth / 2} // TODO: position with half width or not?
        y={padding.top + opacityGradientOffset / 2}
        width={oacityGradientWidth}
        height={innerHeight - opacityGradientOffset}
        fill={'url(#alphaGradient)'}
      />
      <g
        ref={alphaAxisRef}
        transform={`translate(${width - padding.right + 2}, ${padding.top})`}
      />

      {/* Plot area - taking into account the padding  */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        <Histogram data={HistogramData} width={innerWidth} height={innerHeight} />

        {/* Transferfunction keys */}
        <g clipPath={'url(#plotAreaClip)'}>
          {Keys.map((key, i) => {
            const next = Keys[i + 1];

            return (
              <>
                {next && (
                  <line
                    key={`${key.id}-line`}
                    x1={scalarToX(key.scalar)}
                    y1={alphaToY(key.alpha)}
                    x2={scalarToX(next.scalar)}
                    y2={alphaToY(next.alpha)}
                    stroke="#0000007a"
                    strokeWidth={1.5}
                  />
                )}
                <circle
                  key={key.id}
                  cx={scalarToX(key.scalar)}
                  cy={alphaToY(key.alpha)}
                  r={10}
                  fill={key.color}
                  stroke={'#000'}
                  strokeWidth={1.0}
                />
              </>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
