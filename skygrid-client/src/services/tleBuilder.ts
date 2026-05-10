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

export function buildTleLine1(tle: TLEData): string {
  // Extract satellite number (last 5 digits of NORAD_CAT_ID)
  const satNum = String(tle.NORAD_CAT_ID).padStart(5, ' ');

  // Classification (U = unclassified, C = classified, S = secret)
  const classification =
    tle.CLASSIFICATION_TYPE === 'U' ? 'U' : 'U'; // Default to unclassified

  const objectIdParts = tle.OBJECT_ID.match(/(\d{4})-(\d{3})([A-Z])/);
  let intlDes = '00001A';
  if (objectIdParts) {
    const year = objectIdParts[1].substring(2); // Last 2 digits of year
    const launch = objectIdParts[2];
    const piece = objectIdParts[3];
    intlDes = `${year}${launch}${piece}`;
  }

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

  const meanMotionDot = tle.MEAN_MOTION_DOT;
  const meanMotionDotStr = meanMotionDot >= 0 ? ' ' : '';
  const meanMotionDotFormatted = String(Math.abs(meanMotionDot) * 100000)
    .substring(0, 5)
    .padStart(5, '0');

  const meanMotionDdot = tle.MEAN_MOTION_DDOT;
  const meanMotionDdotSign = meanMotionDdot >= 0 ? '+' : '-';
  const meanMotionDdotExponent = String(Math.abs(meanMotionDdot) * 10000000)
    .substring(0, 5)
    .padStart(5, '0');

  const bstar = tle.BSTAR;
  const bstarSign = bstar >= 0 ? '+' : '';
  const bstarMantissa = String(Math.abs(bstar) * 1000000)
    .substring(0, 5)
    .padStart(5, '0');

  const elementSetNo = String(tle.ELEMENT_SET_NO)
    .padStart(4, ' ')
    .substring(0, 4);

  let line1 = `1 ${satNum}${classification} ${intlDes} ${epochYear}${epochDay} ${meanMotionDotStr}${meanMotionDotFormatted} ${meanMotionDdotSign}${meanMotionDdotExponent}-${bstarSign}${bstarMantissa} 0 ${elementSetNo}`;

  const checksum1 = calculateChecksum(line1);
  line1 += checksum1;

  return line1;
}

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

  let line2 = `2 ${satNum} ${inclination} ${raOfAscNode} ${eccentricity} ${argOfPericenter} ${meanAnomaly} ${meanMotion}${revAtEpoch}`;

  const checksum2 = calculateChecksum(line2);
  line2 += checksum2;

  return line2;
}

export function buildTleLines(tle: TLEData): TLELines {
  return {
    line1: buildTleLine1(tle),
    line2: buildTleLine2(tle),
    satelliteName: tle.OBJECT_NAME,
  };
}
