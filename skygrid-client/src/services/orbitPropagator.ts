/**
 * Orbit Propagator - Use satellite.js to compute satellite positions
 * This module handles SGP4 propagation of orbits
 */

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

export interface PropagationError extends Error {
  satelliteId?: string;
  reason: string;
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

    // Parse TLE lines into satellite.js format
    const satrec = satellite.twoline2satrec(tleLines.line1, tleLines.line2);

    // Check for parsing errors
    if (satrec.error !== 0) {
      console.warn(
        `Failed to parse TLE for ${tle.OBJECT_NAME}: error code ${satrec.error}`,
      );
      return null;
    }

    // Propagate to the target time using SGP4
    const positionAndVelocity: PositionAndVelocity | null = satellite.propagate(
      satrec,
      date,
    );

    // Check for propagation errors
    if (positionAndVelocity === null || positionAndVelocity.position === null) {
      console.warn(`SGP4 propagation error for ${tle.OBJECT_NAME}`);
      return null;
    }

    const position = positionAndVelocity.position;
    const velocity = positionAndVelocity.velocity;

    if (!position || typeof position.x !== 'number') {
      return null;
    }

    // Calculate velocity magnitude in km/s
    const velocityMagnitude = Math.sqrt(
      (velocity?.x ?? 0) ** 2 + (velocity?.y ?? 0) ** 2 + (velocity?.z ?? 0) ** 2,
    );

    return {
      id: String(tle.NORAD_CAT_ID),
      name: tle.OBJECT_NAME,
      lat: position.y,
      lng: position.x,
      alt: position.z,
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

/**
 * Propagate satellites and filter by visibility (above horizon for observer)
 * @param tles - Array of TLE data
 * @param date - Date/time for propagation
 * @param observerLat - Observer latitude in degrees (-90 to 90)
 * @param observerLng - Observer longitude in degrees (-180 to 180)
 * @param minElevation - Minimum elevation angle in degrees (default 0)
 * @returns SatellitePosition[] - Visible satellite positions
 */
export function propagateVisible(
  tles: TLEData[],
  date: Date,
  observerLat: number,
  observerLng: number,
  minElevation: number = 0,
): SatellitePosition[] {
  const positions = propagateAll(tles, date);

  return positions.filter((position) => {
    const deltaLat = position.lat - observerLat;
    const deltaLng = position.lng - observerLng;

    // Simple elevation angle approximation (Pythagorean distance in degrees)
    const distanceDegrees = Math.sqrt(deltaLat ** 2 + deltaLng ** 2);
    const elevationAngle = 90 - distanceDegrees; // Rough approximation

    return elevationAngle >= minElevation;
  });
}

