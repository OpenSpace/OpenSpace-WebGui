import { useCameraLatLong } from '@/redux/camera/hooks';
import { useAppSelector } from '@/redux/hooks';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export function ViewCone({ width, height }: { width: number; height: number }) {
  const ref = useRef(null);
  const { latitude, longitude, viewLatitude, viewLongitude } = useCameraLatLong(7);
  const viewLength = useAppSelector((state) => state.camera.viewLength);
  console.log(latitude, longitude, viewLatitude, viewLongitude, viewLength);
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // clear on rerender

    const projection = d3
      .geoEquirectangular()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

    if (
      viewLongitude === undefined ||
      viewLatitude === undefined ||
      latitude === undefined ||
      longitude === undefined ||
      viewLength === undefined
    ) {
      return;
    }
    const center = projection([
      longitude + viewLongitude * viewLength * 40,
      latitude + viewLength * viewLatitude * 40
    ]);
    if (!center) {
      return;
    }
    const radius = width / 70;

    svg
      .append('circle')
      .attr('cx', center[0])
      .attr('cy', center[1])
      .attr('r', radius)
      .attr('fill', 'var(--mantine-primary-color-8)');

    // Compute the triangle
    const tipLatLng: [number, number] = [longitude, latitude];

    const tip = projection(tipLatLng);
    if (!tip) {
      return;
    }

    // Compute direction and perpendicular vector as before
    const dx = tip[0] - center[0];
    const dy = tip[1] - center[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / length;
    const py = dx / length;

    const base1 = [center[0] + px * radius, center[1] + py * radius];
    const base2 = [center[0] - px * radius, center[1] - py * radius];
    svg
      .append('polygon')
      .attr('points', [base1, base2, tip].map((p) => p.join(',')).join(' '))
      .attr('fill', 'var(--mantine-primary-color-8)'); // Use the gradient defined in the SVG defs;
  }, [width, height, latitude, longitude, viewLatitude, viewLongitude, viewLength]);

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
