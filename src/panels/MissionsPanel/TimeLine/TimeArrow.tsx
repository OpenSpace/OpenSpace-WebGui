import { TimeArrowConfig } from './config';

interface TimeArrowProps {
  timeIndicatorRef?: React.RefObject<SVGRectElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  fullWidth: number;
  margin: { top: number; right: number; bottom: number; left: number };
  onClick: () => void;
}

export function TimeArrow({
  timeIndicatorRef,
  svgRef,
  fullWidth,
  margin,
  onClick
}: TimeArrowProps) {
  const indicatorPosition = timeIndicatorRef?.current?.getBoundingClientRect();
  const svgPosition = svgRef.current?.getBoundingClientRect();

  if (!indicatorPosition || !svgPosition) {
    return <></>;
  }

  const isAtTop = indicatorPosition.y <= svgPosition.y + margin.top;
  const isAtBottom = indicatorPosition.bottom > svgPosition.bottom;

  if (!isAtTop && !isAtBottom) {
    return <></>;
  }
  const { width, yOffset, color } = TimeArrowConfig;

  // Center on x across the rectangles
  const xPosition = (fullWidth - margin.left - margin.right) * 0.5 + margin.left;
  // Set arrow either at the top or bottom of the timeline
  const yPosition = isAtTop
    ? margin.top + width * 0.5 + yOffset
    : svgPosition.height - margin.bottom - (width * 0.5 + yOffset);

  const rotation = isAtTop ? 180 : 0;

  // The arrow is centered on origo with its tip being in x=0
  return (
    <polygon
      points={`${-width * 0.5}, ${-width * 0.5}, 0, ${width * 0.5}, ${width * 0.5} ${-width * 0.5}, 0, ${-width * 0.2}`}
      transform={`translate(${xPosition}, ${yPosition})rotate(${rotation})`}
      fill={color}
      onClick={onClick}
      className={'arrow'}
    />
  );
}
