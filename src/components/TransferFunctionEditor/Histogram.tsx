import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface Props {
  width: number;
  height: number;
  data: number[];
}

export function Histogram({ width, height, data }: Props) {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const yGridRef = useRef<SVGGElement | null>(null);

  const bins = d3.bin().thresholds(d3.thresholdFreedmanDiaconis)(data);

  const xScale = d3
    .scaleLinear()
    .domain([bins[0].x0 ?? 0, bins[bins.length - 1].x0 ?? 100])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length) ?? 0])
    .range([height, 0]);

  useEffect(() => {
    if (xAxisRef.current) {
      const axis = d3
        .axisBottom(xScale)
        .ticks(bins.length / 2)
        .tickSizeOuter(0);
      d3.select(xAxisRef.current).call(axis);
    }
    if (yAxisRef.current) {
      const axis = d3.axisLeft(yScale).ticks(10).tickSizeOuter(0);
      d3.select(yAxisRef.current).call(axis);
    }

    if (yGridRef.current) {
      const grid = d3
        .axisLeft(yScale)
        .ticks(10)
        .tickSize(-width)
        .tickFormat(() => ''); // Hide labels

      d3.select(yGridRef.current).call(grid);
    }
  }, [xScale, yScale]);

  const area = d3
    .area<d3.Bin<number, number>>()
    .x((d) => xScale(d.x0 ?? 0))
    .y0(yScale(0))
    .y1((d) => yScale(d.length))
    .curve(d3.curveMonotoneX);

  return (
    <g>
      <g ref={yGridRef} strokeOpacity={0.3} />
      <path
        d={area(bins) ?? ''}
        fill={'#070b0fc5'}
        fillOpacity={0.5}
        stroke="#70b2e9d3"
      />

      <g ref={xAxisRef} transform={`translate(0,${height})`} />
      <g ref={yAxisRef} />
    </g>
  );
}
