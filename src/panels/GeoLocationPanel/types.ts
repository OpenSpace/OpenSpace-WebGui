export type MouseMarkerPosition =
  | {
      x: number;
      y: number;
    }
  | undefined;

export type GeoCoordinates = {
  // Provided in decimal degrees in the range [-90, 90]
  lat: number;
  // Provided in decimal degress in the range [-180, 180]
  long: number;
  // Provided in km
  alt: number;
};
