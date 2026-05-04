/**
 * TLE Builder - Convert CelesTrak JSON to TLE line strings
 * satellite.js expects TLE data in the classic two-line format from NORAD
 */

import type { TLEData } from './celestrakService';

export interface TLELines {
  line1: string;
  line2: string;
  satelliteName: string;
}

/**
 * Convert epoch string (YYYYDDD.DDDDDDDD format) to JavaScript Date
 * @param epochStr - Epoch in format "YYYYDDD.DDDDDDDD"
 * @returns Date object
 */
function epochToDate(epochStr: string): Date {
  const year = parseInt(epochStr.substring(0, 4), 10);
  const dayOfYear = parseFloat(epochStr.substring(4, 8));

  const startOfYear = new Date(year, 0, 1);
  const date = new Date(
    startOfYear.getTime() + (dayOfYear - 1) * 24 * 60 * 60 * 1000,
  );

  return date;
}

/**
 * Calculate checksum for TLE line (mod 10 of sum of digits)
 */
function calculateChecksum(line: string): number {
  let sum = 0;
  for (const char of line) {
    if (/\d/.test(char)) {
      sum += parseInt(char, 10);
    } else if (char === '-') {
      sum += 1;
    }
  }
  return sum % 10;
}

/**
 * Build TLE Line 1 from CelesTrak TLEData
 * Format: 1 NNNNNX NNNNNAAA NNNNN NNN NNNNN.NNNNNNNN  .NNNNNNNN  NNNNN-N NNNNN-N N NNNNN
 */
export function buildTleLine1(tle: TLEData): string {
  // Extract satellite number (last 5 digits of NORAD_CAT_ID)
  const satNum = String(tle.NORAD_CAT_ID).padStart(5, ' ');

  // Classification (U = unclassified, C = classified, S = secret)
  const classification =
    tle.CLASSIFICATION_TYPE === 'U' ? 'U' : 'U'; // Default to unclassified

  // International designation (YYNNNAAA format) - derived from OBJECT_ID
  // Format is like "1998-067A", we need "98067A"
  const objectIdParts = tle.OBJECT_ID.match(/(\d{4})-(\d{3})([A-Z])/);
  let intlDes = '00001A';
  if (objectIdParts) {
    const year = objectIdParts[1].substring(2); // Last 2 digits of year
    const launch = objectIdParts[2];
    const piece = objectIdParts[3];
    intlDes = `${year}${launch}${piece}`;
  }

  // Epoch year and day of year
  const epochDate = epochToDate(tle.EPOCH);
  const epochYear = String(epochDate.getFullYear()).substring(2);
  const dayOfYear = Math.floor(
    (epochDate.getTime() - new Date(epochDate.getFullYear(), 0, 0).getTime()) /
      (24 * 60 * 60 * 1000),
  );
  const epochDayFraction =
    (epochDate.getHours() * 3600 +
      epochDate.getMinutes() * 60 +
      epochDate.getSeconds()) /
    (24 * 3600);
  const epochDay = String(dayOfYear + epochDayFraction)
    .padStart(5, '0')
    .substring(0, 8)
    .padEnd(8, '0');

  // First derivative of mean motion (decay rate)
  const meanMotionDot = tle.MEAN_MOTION_DOT;
  const meanMotionDotStr = meanMotionDot >= 0 ? ' ' : '';
  const meanMotionDotFormatted = String(Math.abs(meanMotionDot) * 100000)
    .substring(0, 5)
    .padStart(5, '0');

  // Second derivative of mean motion (rarely used, usually 0)
  const meanMotionDdot = tle.MEAN_MOTION_DDOT;
  const meanMotionDdotSign = meanMotionDdot >= 0 ? '+' : '-';
  const meanMotionDdotExponent = String(Math.abs(meanMotionDdot) * 10000000)
    .substring(0, 5)
    .padStart(5, '0');

  // B* drag term
  const bstar = tle.BSTAR;
  const bstarSign = bstar >= 0 ? '+' : '';
  const bstarMantissa = String(Math.abs(bstar) * 1000000)
    .substring(0, 5)
    .padStart(5, '0');

  // Element set number
  const elementSetNo = String(tle.ELEMENT_SET_NO)
    .padStart(4, ' ')
    .substring(0, 4);

  // Build line 1 without checksum
  let line1 = `1 ${satNum}${classification} ${intlDes} ${epochYear}${epochDay} ${meanMotionDotStr}${meanMotionDotFormatted} ${meanMotionDdotSign}${meanMotionDdotExponent}-${bstarSign}${bstarMantissa} 0 ${elementSetNo}`;

  // Calculate and append checksum
  const checksum1 = calculateChecksum(line1);
  line1 += checksum1;

  return line1;
}

/**
 * Build TLE Line 2 from CelesTrak TLEData
 * Format: 2 NNNNN NNN.NNNN NNN.NNNN NNNNNNN NNN.NNNN NNN.NNNN NN.NNNNNNNNNNNNNN NNNNN
 */
export function buildTleLine2(tle: TLEData): string {
  const satNum = String(tle.NORAD_CAT_ID).padStart(5, ' ');
  const inclination = String(tle.INCLINATION).padStart(8, ' ').substring(0, 8);
  const raOfAscNode = String(tle.RA_OF_ASC_NODE)
    .padStart(8, ' ')
    .substring(0, 8);
  const eccentricity = String(Math.round(tle.ECCENTRICITY * 10000000))
    .padStart(7, '0')
    .substring(0, 7);
  const argOfPericenter = String(tle.ARG_OF_PERICENTER)
    .padStart(8, ' ')
    .substring(0, 8);
  const meanAnomaly = String(tle.MEAN_ANOMALY)
    .padStart(8, ' ')
    .substring(0, 8);
  const meanMotion = String(tle.MEAN_MOTION)
    .padStart(11, ' ')
    .substring(0, 11);
  const revAtEpoch = String(tle.REV_AT_EPOCH)
    .padStart(5, ' ')
    .substring(0, 5);

  // Build line 2 without checksum
  let line2 = `2 ${satNum} ${inclination} ${raOfAscNode} ${eccentricity} ${argOfPericenter} ${meanAnomaly} ${meanMotion}${revAtEpoch}`;

  // Calculate and append checksum
  const checksum2 = calculateChecksum(line2);
  line2 += checksum2;

  return line2;
}

/**
 * Convert TLE data to satellite.js compatible TLE lines
 */
export function buildTleLines(tle: TLEData): TLELines {
  return {
    line1: buildTleLine1(tle),
    line2: buildTleLine2(tle),
    satelliteName: tle.OBJECT_NAME,
  };
}
