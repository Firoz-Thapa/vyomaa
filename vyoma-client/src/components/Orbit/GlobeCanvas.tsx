import { useEffect, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import type { SatellitePosition } from '../../services/orbitPropagator';
import './Orbit.css';

interface GlobeCanvasProps {
  positions: SatellitePosition[];
  width?: number;
  height?: number;
}

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

function buildProjectedPosition(
  lat: number,
  lng: number,
  radius: number,
  rotation: number,
): { x: number; y: number; z: number } {
  const phi = toRadians(lat);
  const theta = toRadians(lng) + rotation;
  const cosPhi = Math.cos(phi);

  const x = radius * cosPhi * Math.sin(theta);
  const y = -radius * Math.sin(phi);
  const z = radius * cosPhi * Math.cos(theta);

  return { x, y, z };
}

function drawGridToOffscreen(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  globeRadius: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
  ctx.lineWidth = 1;

  // Latitude lines only (horizontal ellipses - these don't rotate)
  for (let lat = -60; lat <= 60; lat += 30) {
    const latRadius = globeRadius * Math.cos(toRadians(lat));
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, latRadius, globeRadius * 0.16 + 1, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default function GlobeCanvas({
  positions,
  width = 340,
  height = 340,
}: GlobeCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<number>(0);
  const draggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const positionsRef = useRef<SatellitePosition[]>(positions);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientsRef = useRef<{ [key: string]: CanvasGradient }>({});
  const lastCanvasSizeRef = useRef<{ width: number; height: number } | null>(null);
  const sortedSatellitesRef = useRef<SatellitePosition[]>([]);

  useEffect(() => {
    positionsRef.current = positions;
    sortedSatellitesRef.current = [...positions].sort((a, b) => b.alt - a.alt);
  }, [positions]);

  const drawFrame = useMemo(
    () => {
      return () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }

        const dpr = window.devicePixelRatio || 1;
        const scaledWidth = width * dpr;
        const scaledHeight = height * dpr;
        const centerX = width / 2;
        const centerY = height / 2;
        const globeRadius = Math.min(width, height) / 2 - 18;

        // Only set canvas size once per dimension change
        if (
          !lastCanvasSizeRef.current ||
          lastCanvasSizeRef.current.width !== scaledWidth ||
          lastCanvasSizeRef.current.height !== scaledHeight
        ) {
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          lastCanvasSizeRef.current = { width: scaledWidth, height: scaledHeight };
          gradientsRef.current = {}; // Clear cached gradients on resize
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const rotation = rotationRef.current;

        // Get or create cached gradients
        if (!gradientsRef.current.bg) {
          const bgGradient = ctx.createRadialGradient(
            centerX,
            centerY,
            globeRadius * 0.1,
            centerX,
            centerY,
            globeRadius * 1.1,
          );
          bgGradient.addColorStop(0, '#061221');
          bgGradient.addColorStop(1, '#02070f');
          gradientsRef.current.bg = bgGradient;
        }

        ctx.fillStyle = gradientsRef.current.bg;
        ctx.fillRect(0, 0, width, height);

        // Globe fill
        if (!gradientsRef.current.globe) {
          const globeGradient = ctx.createRadialGradient(
            centerX - globeRadius * 0.2,
            centerY - globeRadius * 0.2,
            globeRadius * 0.1,
            centerX,
            centerY,
            globeRadius,
          );
          globeGradient.addColorStop(0, '#0f2c57');
          globeGradient.addColorStop(1, '#051225');
          gradientsRef.current.globe = globeGradient;
        }

        ctx.fillStyle = gradientsRef.current.globe;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Horizon glow
        if (!gradientsRef.current.horizon) {
          const horizonGradient = ctx.createRadialGradient(
            centerX,
            centerY,
            globeRadius * 0.8,
            centerX,
            centerY,
            globeRadius * 1.15,
          );
          horizonGradient.addColorStop(0, 'rgba(0, 212, 255, 0.08)');
          horizonGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
          gradientsRef.current.horizon = horizonGradient;
        }

        ctx.fillStyle = gradientsRef.current.horizon;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw static latitude grid from offscreen canvas
        if (offscreenCanvasRef.current) {
          ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        }

        // Draw rotating longitude lines
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let lng = 0; lng < 360; lng += 30) {
          const points = 32;
          const meridianPoints: Array<{ x: number; y: number; z: number }> = [];
          let visibleCount = 0;
          let maxZ = -Infinity;

          // Calculate all points and find max z-depth
          for (let i = 0; i <= points; i += 1) {
            const lat = 90 - (i / points) * 180;
            const projected = buildProjectedPosition(lat, lng, globeRadius, rotation);
            meridianPoints.push(projected);
            if (projected.z > 0) {
              visibleCount += 1;
              maxZ = Math.max(maxZ, projected.z);
            }
          }

          // Only draw meridian if significantly facing the camera (max z > 20% of radius)
          if (visibleCount > points * 0.75 && maxZ > globeRadius * 0.2) {
            ctx.beginPath();
            let pathStarted = false;
            for (let i = 0; i <= points; i += 1) {
              const projected = meridianPoints[i];
              if (projected.z > 0) {
                const x = centerX + projected.x;
                const y = centerY + projected.y;
                if (!pathStarted) {
                  ctx.moveTo(x, y);
                  pathStarted = true;
                } else {
                  ctx.lineTo(x, y);
                }
              } else {
                // Break the line if we go behind the globe
                if (pathStarted) {
                  ctx.stroke();
                  ctx.beginPath();
                  pathStarted = false;
                }
              }
            }
            if (pathStarted) {
              ctx.stroke();
            }
          }
        }

        // Satellite markers - use pre-sorted array
        sortedSatellitesRef.current.forEach((sat) => {
          const projected = buildProjectedPosition(sat.lat, sat.lng, globeRadius, rotation);
          if (projected.z < 0) {
            return;
          }
          const screenX = centerX + projected.x;
          const screenY = centerY + projected.y;
          const altitudeFactor = Math.min(Math.max((sat.alt ?? 0) / 600, 0), 1);
          const radius = 3 + altitudeFactor * 1.7;

          // Glow
          const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 3);
          glow.addColorStop(0, 'rgba(0, 255, 255, 0.65)');
          glow.addColorStop(1, 'rgba(0, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = '#00ffd8';
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Outer glow ring
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.stroke();
      };
    },
    [height, width],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    // Initialize offscreen canvas for static grid
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }

    const globeRadius = Math.min(width, height) / 2 - 18;
    drawGridToOffscreen(offscreenCanvasRef.current, width, height, globeRadius);

    let animationFrame = 0;

    const renderLoop = () => {
      if (!draggingRef.current) {
        rotationRef.current += 0.002;
      }
      drawFrame();
      animationFrame = requestAnimationFrame(renderLoop);
    };

    const handleDown = (event: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = event.clientX;
    };

    const handleMove = (event: PointerEvent) => {
      if (!draggingRef.current) {
        return;
      }
      const delta = event.clientX - lastXRef.current;
      rotationRef.current += delta * 0.005;
      lastXRef.current = event.clientX;
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointerleave', handleUp);

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointerleave', handleUp);
    };
  }, [drawFrame, height, width]);

  return (
    <div className="globe-canvas-container">
      <canvas ref={canvasRef} aria-label="Satellite globe visualization" />
    </div>
  );
}
