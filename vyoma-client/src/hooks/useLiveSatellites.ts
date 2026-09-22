import { useState, useEffect, useCallback, useRef } from 'react';
import type { TLEData } from '../services/celestrakService';
import { fetchSatelliteGroup, type FetchError } from '../services/celestrakService';
import type { SatellitePosition } from '../services/orbitPropagator';
import { propagateAll } from '../services/orbitPropagator';

export interface UseLiveSatellitesOptions {
  group: string;
  updateIntervalMs?: number; // How often to re-propagate positions (default: 5000ms)
  refreshTleAfterMs?: number; // How often to fetch new TLE data (default: 3600000ms = 1 hour)
}

export interface UseLiveSatellitesResult {
  positions: SatellitePosition[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastUpdate: Date | null;
  lastTleRefresh: Date | null;
}

export function useLiveSatellites(
  options: UseLiveSatellitesOptions,
): UseLiveSatellitesResult {
  const {
    group,
    updateIntervalMs = 5000,
    refreshTleAfterMs = 3600000,
  } = options;

  const [positions, setPositions] = useState<SatellitePosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [lastTleRefresh, setLastTleRefresh] = useState<Date | null>(null);

  const tleDataRef = useRef<TLEData[]>([]);
  const tleRefreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const propagationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshTleData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const data = await fetchSatelliteGroup(group);
      tleDataRef.current = data;
      setLastTleRefresh(new Date());

      const now = new Date();
      const newPositions = propagateAll(data, now);
      setPositions(newPositions);
      setLastUpdate(now);
    } catch (err) {
      const errorMessage =
        err instanceof Error && 'url' in err
          ? `Failed to fetch satellite data: ${err.message} (URL: ${(err as unknown as FetchError).url})`
          : err instanceof Error
            ? `Error fetching satellite data: ${err.message}`
            : `Unknown error fetching satellite data`;

      setError(errorMessage);
      console.error(errorMessage);
    }
  }, [group]);

  const propagatePositions = useCallback((): void => {
    if (tleDataRef.current.length === 0) {
      return;
    }

    try {
      const now = new Date();
      const newPositions = propagateAll(tleDataRef.current, now);
      setPositions(newPositions);
      setLastUpdate(now);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? `Error propagating positions: ${err.message}`
          : `Unknown error propagating positions`;

      setError(errorMessage);
      console.error(errorMessage);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeSatellites = async (): Promise<void> => {
      try {
        setLoading(true);
        await refreshTleData();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeSatellites();

    return () => {
      isMounted = false;
    };
  }, [group, refreshTleData]);

  useEffect(() => {
    tleRefreshIntervalRef.current = setInterval(() => {
      refreshTleData();
    }, refreshTleAfterMs);

    return () => {
      if (tleRefreshIntervalRef.current !== null) {
        clearInterval(tleRefreshIntervalRef.current);
      }
    };
  }, [refreshTleAfterMs, refreshTleData]);

  useEffect(() => {
    propagatePositions();

    propagationIntervalRef.current = setInterval(() => {
      propagatePositions();
    }, updateIntervalMs);

    return () => {
      if (propagationIntervalRef.current !== null) {
        clearInterval(propagationIntervalRef.current);
      }
    };
  }, [updateIntervalMs, propagatePositions]);

  useEffect(() => {
    return () => {
      if (tleRefreshIntervalRef.current !== null) {
        clearInterval(tleRefreshIntervalRef.current);
      }
      if (propagationIntervalRef.current !== null) {
        clearInterval(propagationIntervalRef.current);
      }
    };
  }, []);

  return {
    positions,
    loading,
    error,
    totalCount: tleDataRef.current.length,
    lastUpdate,
    lastTleRefresh,
  };
}
