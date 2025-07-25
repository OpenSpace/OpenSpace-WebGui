import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  width: number;
  height: number;
}

// TODO: ylvse 2025-07-11 Rewrite this as a React component that uses hooks instead of D3 directly.
export function NightShadow({ width, height }: Props) {
  const { subSolarLatitude, subSolarLongitude } = useAppSelector((state) => state.camera);

  useSubscribeToCamera();
  const ref = useRef(null);

  useEffect(() => {
    if (subSolarLatitude === undefined || subSolarLongitude === undefined) {
      return;
    }
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // clear on rerender

    const projection = d3
      .geoEquirectangular()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

    const geoGenerator = d3.geoPath().projection(projection);

    // Opposite side of subsolar point
    const nightCenter: [number, number] = [subSolarLongitude + 180, -subSolarLatitude];

    // Create the day/night terminator line (great circle)
    const duskCircle = d3
      .geoCircle()
      .center(nightCenter)
      .radius(95) // Technically this should be 90 degrees, but we use 95 to make it align with the shadow in the rendering
      .precision(0.5)();

    const nightCircle = d3
      .geoCircle()
      .center(nightCenter)
      .radius(87) // 87 degrees for the night line
      .precision(0.5)();

    // Draw night shadow
    svg
      .append('path')
      .datum(nightCircle)
      .attr('fill', 'var(--mantine-color-dark-9)')
      .attr('opacity', 0.4)
      .attr('d', geoGenerator);

    svg
      .append('path')
      .datum(duskCircle)
      .attr('fill', 'var(--mantine-color-dark-9)')
      .attr('opacity', 0.4)
      .attr('d', geoGenerator);
  }, [subSolarLatitude, subSolarLongitude, width, height]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
