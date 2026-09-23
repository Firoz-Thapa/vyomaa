import * as satellite from 'satellite.js';
import type { TLEData } from './celestrakService';
import { buildTleLines } from './tleBuilder';
import type { PositionAndVelocity } from 'satellite.js';

export interface SatellitePosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
}

/**
 * Propagate a single satellite's position at a given date
 * @param tle - TLE data from CelesTrak
 * @param date - Date/time for propagation
 * @returns SatellitePosition | null - Satellite position or null if propagation fails
 */
export function propagateSatellite(
  tle: TLEData,
  date: Date,
): SatellitePosition | null {
  try {
    const tleLines = buildTleLines(tle);

    const satrec = satellite.twoline2satrec(tleLines.line1, tleLines.line2);

    if (satrec.error !== 0) {
      console.warn(
        `Failed to parse TLE for ${tle.OBJECT_NAME}: error code ${satrec.error}`,
      );
      return null;
    }

    const positionAndVelocity: PositionAndVelocity | null = satellite.propagate(
      satrec,
      date,
    );

    if (positionAndVelocity === null || positionAndVelocity.position === null) {
      console.warn(`SGP4 propagation error for ${tle.OBJECT_NAME}`);
      return null;
    }

    const position = positionAndVelocity.position;
    const velocity = positionAndVelocity.velocity;

    if (!position || typeof position.x !== 'number') {
      return null;
    }

    const velocityMagnitude = Math.sqrt(
      (velocity?.x ?? 0) ** 2 + (velocity?.y ?? 0) ** 2 + (velocity?.z ?? 0) ** 2,
    );

    const gmst = satellite.gstime(date);
    const geo = satellite.eciToGeodetic(position, gmst);
    const lat = satellite.degreesLat(geo.latitude);
    const lng = satellite.degreesLong(geo.longitude);
    const alt = geo.height;

    return {
      id: String(tle.NORAD_CAT_ID),
      name: tle.OBJECT_NAME,
      lat,
      lng,
      alt,
      velocity: velocityMagnitude,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Error propagating satellite ${tle.OBJECT_NAME}: ${msg}`);
    return null;
  }
}

/**
 * Propagate multiple satellites at a given time
 * @param tles - Array of TLE data
 * @param date - Date/time for propagation
 * @returns SatellitePosition[] - Array of successfully propagated positions
 */
export function propagateAll(
  tles: TLEData[],
  date: Date,
): SatellitePosition[] {
  const positions: SatellitePosition[] = [];

  for (const tle of tles) {
    const position = propagateSatellite(tle, date);
    if (position !== null) {
      positions.push(position);
    }
  }

  return positions;
}

