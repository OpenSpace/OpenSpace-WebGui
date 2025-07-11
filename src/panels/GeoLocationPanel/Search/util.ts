import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { ArcGISJSON, Extent, MatchedLocation } from './types';

export const ET_URL = 'http://localhost:3000/1/search/';

const ARC_GIS_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

export async function fetchPlacesEarth(searchString: string): Promise<MatchedLocation[]> {
  const response = await fetch(
    `${ARC_GIS_URL}?SingleLine=${searchString}&category=&outFields=*&forStorage=false&f=json`
  );
  const arcGISJson: ArcGISJSON = await response.json();
  // Remove any duplicates from search result
  const uniqueLabels: string[] = [];
  const uniquePlaces = arcGISJson.candidates.filter((place) => {
    const isDuplicate = uniqueLabels.includes(place.attributes.LongLabel);

    if (!isDuplicate) {
      uniqueLabels.push(place.attributes.LongLabel);
      return true;
    }
    return false;
  });
  return uniquePlaces.map((place) => {
    return {
      centerLatitude: place.location.y,
      centerLongitude: place.location.x,
      name: place.attributes.LongLabel,
      origin: ''
    };
  });
}

export function calculateAltitudeExtraTerrestial(
  lat: number,
  long: number,
  diameter: number
): number {
  // @TODO: (ylvse 2025-07-11) Do something smart here with the radius of the celestial body
  return 2 * diameter;
}

export function calculateAltitudeEarth(extent: Extent): number {
  // Get lat long corners of polygon
  const nw = new LatLng(extent.ymax, extent.xmin);
  const ne = new LatLng(extent.ymax, extent.xmax);
  const sw = new LatLng(extent.ymin, extent.xmin);
  const se = new LatLng(extent.ymin, extent.xmax);
  // Distances are in meters
  const height = computeDistanceBetween(nw, sw);
  const lengthBottom = computeDistanceBetween(sw, se);
  const lengthTop = computeDistanceBetween(nw, ne);
  const maxLength = Math.max(lengthBottom, lengthTop);
  const largestDist = Math.max(height, maxLength);
  // 0.61 is the radian of 35 degrees - half of the standard horizontal field of view in OpenSpace
  return (0.5 * largestDist) / Math.tan(0.610865238);
}
