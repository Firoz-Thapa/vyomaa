export interface TLEData {
  OBJECT_NAME: string;
  NORAD_CAT_ID: number;
  EPOCH: string;
  MEAN_MOTION: number;
  ECCENTRICITY: number;
  INCLINATION: number;
  RA_OF_ASC_NODE: number;
  ARG_OF_PERICENTER: number;
  MEAN_ANOMALY: number;
  CLASSIFICATION_TYPE: string;
  OBJECT_ID: string;
  ELEMENT_SET_NO: number;
  REV_AT_EPOCH: number;
  BSTAR: number;
  MEAN_MOTION_DOT: number;
  MEAN_MOTION_DDOT: number;
}

export interface FetchError extends Error {
  statusCode?: number;
  url: string;
}

function getMockTLEData(group: string): TLEData[] {
  const now = new Date();
  const year = now.getUTCFullYear();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(year, 0, 0).getTime()) / (24 * 60 * 60 * 1000),
  );
  const epochStr = `${year}${String(dayOfYear).padStart(3, '0')}.${String(now.getUTCHours()).padStart(2, '0')}`;

  if (group.toLowerCase() === 'starlink') {
    return Array.from({ length: 50 }, (_, i) => ({
      OBJECT_NAME: `STARLINK-${1000 + i}`,
      NORAD_CAT_ID: 45000 + i,
      EPOCH: epochStr,
      MEAN_MOTION: 14.5,
      ECCENTRICITY: 0.0001 + Math.random() * 0.0002,
      INCLINATION: 53.05 + Math.random() * 0.1,
      RA_OF_ASC_NODE: Math.random() * 360,
      ARG_OF_PERICENTER: Math.random() * 360,
      MEAN_ANOMALY: Math.random() * 360,
      CLASSIFICATION_TYPE: 'U',
      OBJECT_ID: `2019-029${String(i).padStart(2, '0')}`,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 1000 + i,
      BSTAR: -0.00001,
      MEAN_MOTION_DOT: 0.00001,
      MEAN_MOTION_DDOT: 0.0,
    }));
  }

  return Array.from({ length: 20 }, (_, i) => ({
    OBJECT_NAME: `SAT-${i}`,
    NORAD_CAT_ID: 25000 + i,
    EPOCH: epochStr,
    MEAN_MOTION: 14.5,
    ECCENTRICITY: 0.0005,
    INCLINATION: 50 + Math.random() * 40,
    RA_OF_ASC_NODE: Math.random() * 360,
    ARG_OF_PERICENTER: Math.random() * 360,
    MEAN_ANOMALY: Math.random() * 360,
    CLASSIFICATION_TYPE: 'U',
    OBJECT_ID: `2000-001${String(i).padStart(2, '0')}`,
    ELEMENT_SET_NO: 999,
    REV_AT_EPOCH: 5000 + i,
    BSTAR: -0.00001,
    MEAN_MOTION_DOT: 0.00001,
    MEAN_MOTION_DDOT: 0.0,
  }));
}

/**
 * Fetch satellite TLE data from CelesTrak API
 * Fetches from multiple endpoints and falls back to mock data if unavailable
 * @param group - Satellite group name (e.g., 'starlink', 'active', 'weather')
 * @returns Promise<TLEData[]> - Array of TLE data objects
 */
export async function fetchSatelliteGroup(group: string): Promise<TLEData[]> {
  const endpoints = [
    `https://api.celestrak.org/group/${group}.json`,
    `https://celestrak.com/NORAD/elements/${group}.json`,
  ];

  let lastError: FetchError | null = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          continue; // Try next endpoint
        }

        const error: FetchError = new Error(
          `CelesTrak API error: ${response.status} ${response.statusText}`,
        ) as FetchError;
        error.statusCode = response.status;
        error.url = url;
        lastError = error;
        continue;
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        const error: FetchError = new Error(
          'CelesTrak API returned unexpected format: expected array',
        ) as FetchError;
        error.url = url;
        lastError = error;
        continue;
      }

      return data as TLEData[];
    } catch (error) {
      const networkError: FetchError = new Error(
        `Network error fetching from ${url}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ) as FetchError;
      networkError.url = url;
      lastError = networkError;
      // Continue to next endpoint
    }
  }

  console.warn(
    `CelesTrak API unavailable (${lastError?.message}). Using mock satellite data for development.`,
  );
  return getMockTLEData(group);
}
