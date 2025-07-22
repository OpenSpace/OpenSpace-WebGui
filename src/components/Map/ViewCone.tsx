import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { useProperty } from '@/hooks/properties';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useCameraLatLong } from '@/redux/camera/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useAnchorNode } from '@/util/propertyTreeHooks';

interface Props {
  width: number;
  height: number;
  coneWidth: number;
  coneHeight: number;
}

// TODO: ylvse 2025-07-11 Rewrite this as a React component that uses hooks instead of D3 directly.
export function ViewCone({ width, height, coneWidth, coneHeight }: Props) {
  const ref = useRef(null);
  const { latitude, longitude, viewLatitude, viewLongitude } = useCameraLatLong(7);
  const viewLength = useAppSelector((state) => state.camera.viewLength);
  const anchor = useAnchorNode();
  const [interactionSphere] = useProperty(
    'DoubleProperty',
    `Scene.${anchor?.identifier}.EvaluatedInteractionSphere`
  );
  const { altitudeMeters } = useAppSelector((state) => state.camera);
  useSubscribeToCamera();
  const shouldShowCone =
    altitudeMeters && interactionSphere && altitudeMeters < interactionSphere * 3;

  useEffect(() => {
    if (shouldShowCone) {
      d3.select('#circle')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    } else {
      d3.select('#circle').transition().duration(1000).style('opacity', 0);
    }
  }, [shouldShowCone]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // clear on rerender

    const defs = svg.append('defs');
    const gradient = defs.append('radialGradient').attr('id', 'viewConeGradient');

    gradient
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--mantine-primary-color-8)')
      .attr('stop-opacity', 0.7);

    gradient
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '60%')
      .attr('stop-color', 'var(--mantine-primary-color-8)')
      .attr('stop-opacity', 0.7);

    gradient
      .append('stop')
      .attr('class', 'end')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--mantine-primary-color-5)')
      .attr('stop-opacity', 0);

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
    if (viewLength > 0.3) {
      return;
    }
    const convertedViewLength = 1 + viewLength;
    const center = projection([
      longitude + viewLongitude * convertedViewLength * coneHeight,
      latitude + viewLatitude * convertedViewLength * coneHeight
    ]);
    if (!center) {
      return;
    }
    const radius = coneWidth;

    svg
      .append('circle')
      .attr('id', 'circle')
      .attr('cx', center[0])
      .attr('cy', center[1])
      .attr('r', radius + 2)
      .attr('fill', 'url(#viewConeGradient)');

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

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linearGradient')
      .attr('x1', tip[0])
      .attr('x2', center[0])
      .attr('y1', tip[1])
      .attr('y2', center[1])
      .attr('gradientUnits', 'userSpaceOnUse');

    linearGradient
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--mantine-primary-color-8)')
      .attr('stop-opacity', 1);

    linearGradient
      .append('stop')
      .attr('class', 'middle')
      .attr('offset', '60%')
      .attr('stop-color', 'var(--mantine-primary-color-8)')
      .attr('stop-opacity', 0.6);

    linearGradient
      .append('stop')
      .attr('class', 'end')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--mantine-primary-color-8)')
      .attr('stop-opacity', 0);

    svg
      .append('polygon')
      .attr('points', [base1, base2, tip].map((p) => p.join(',')).join(' '))
      .attr('fill', 'url(#linearGradient)'); // Use the gradient defined in the SVG defs;
  }, [
    width,
    height,
    latitude,
    longitude,
    viewLatitude,
    viewLongitude,
    viewLength,
    coneWidth,
    coneHeight
  ]);

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
