import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import { ArcGISJSON, Extent, MatchedLocation } from './types';

// URL to the geolocation service other celestial bodies than Earth
const ET_GEOLOCATION_URL = 'https://geocode.openspaceproject.com/1/search/';

// URL to the geolocation service for Earth
const ARC_GIS_GEOLOCATION_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

/**
 * Get a list of places on Earth, based on the search string. Uses the ArcGIS geolocation
 * service.
 *
 * @param searchString The search string to query the ArcGIS geolocation service
 * @returns a list of matched locations
 */
export async function fetchPlacesEarth(searchString: string): Promise<MatchedLocation[]> {
  const response = await fetch(
    `${ARC_GIS_GEOLOCATION_URL}?SingleLine=${searchString}&category=&outFields=*&forStorage=false&f=json`
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

  return uniquePlaces.map((place) => ({
    centerLatitude: place.location.y,
    centerLongitude: place.location.x,
    name: place.attributes.LongLabel,
    origin: ''
  }));
}

/**
 * Get a list of places on other celestial bodies than Earth, based on the search string.
 * Uses the OpenSpace geolocation service.
 *
 * @param globeName The name of the celestial body to search on
 * @param searchString The search string to query the OpenSpace geolocation service
 * @returns a list of matched locations
 */
export async function fetchPlacesExtraTerrestrial(
  globeName: string,
  searchString: string
): Promise<MatchedLocation[]> {
  const json = await fetch(
    `${ET_GEOLOCATION_URL}${globeName}?query=${searchString}`
  ).then((res) => res.json());
  return json.result;
}

/**
 * Checks if the given object has geolocation data available.
 *
 * @param globeName The name of the celestial body to check
 * @returns true if geolocation data is available, false otherwise
 */
export async function hasGeoLocationData(objectName: string): Promise<boolean> {
  if (objectName === 'Earth') {
    return true; // Earth uses a different service, and always has geolocation data
  }
  try {
    const response = await fetch(`${ET_GEOLOCATION_URL}${objectName}`);
    const data = await response.json();
    return data.hasData;
  } catch {
    return false;
  }
}

export function calculateAltitudeExtraTerrestial(diameter: number): number {
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

export function computeAltitude(place: MatchedLocation) {
  // If the place is on Earth, it will have the extent property, otherwise it will have
  // the diameter property
  if (place.extent) {
    return calculateAltitudeEarth(place.extent);
  } else if (place.diameter) {
    return calculateAltitudeExtraTerrestial(place.diameter);
  }
  return 0; // Default altitude if no diameter or extent is provided
}
