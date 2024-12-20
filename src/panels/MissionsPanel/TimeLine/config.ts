export const TimeLineConfig = {
  // Set the dimensions and margins of the graph
  margin: {
    top: 10,
    right: 2,
    bottom: 10,
    left: 60
  },
  paddingGraph: {
    top: 4,
    inner: 5,
    bottom: 4
  },
  // Minimum width of a phase
  minLevelWidth: 20,
  height: 550,
  // Width of graph
  maxWidth: 90, // previously fullWidth
  maxScale: 1000,
  // Given in milliseconds
  transitionDuration: 750
};

export const TimeIndicatorConfig = {
  // Time indicator
  color: 'white',
  borderColor: 'black',
  borderWidth: 0.5,
  lineWidth: 3
};

export const TimeArrowConfig = {
  width: 30,
  yOffset: 5,
  color: 'white'
};

export const PhaseRectangleConfig = {
  radius: 2,
  borderColor: 'white',
  borderWidth: 2,
  gap: 0.5
};

export const MileStoneConfig = {
  size: 12,
  borderWidth: 2,
  color: 'orange',
  borderColor: 'white'
};

export const ActivityCircleConfig = {
  radius: 3,
  color: 'yellow',
  xOffset: 5
};