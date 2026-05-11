import { useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  const [isReady, setIsReady] = useState(false);

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

        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const globeRadius = Math.min(width, height) / 2 - 18;
        const rotation = rotationRef.current;

        // Background
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
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Globe fill
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
        ctx.fillStyle = globeGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Horizon glow
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
        ctx.fillStyle = horizonGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
        ctx.lineWidth = 1;

        for (let lat = -60; lat <= 60; lat += 30) {
          const latRadius = globeRadius * Math.cos(toRadians(lat));
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, latRadius, globeRadius * 0.16 + 1, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let lng = 0; lng < 360; lng += 30) {
          ctx.beginPath();
          const points = 32;
          for (let i = 0; i <= points; i += 1) {
            const lat = 90 - (i / points) * 180;
            const projected = buildProjectedPosition(lat, lng, globeRadius, rotation);
            const x = centerX + projected.x;
            const y = centerY + projected.y;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Satellite markers
        const satellites = positionsRef.current
          .slice()
          .sort((a, b) => b.alt - a.alt);

        satellites.forEach((sat) => {
          const projected = buildProjectedPosition(sat.lat, sat.lng, globeRadius, rotation);
          if (projected.z < 0) {
            return;
          }
          const screenX = centerX + projected.x;
          const screenY = centerY + projected.y;
          const altitudeFactor = Math.min(Math.max((sat.alt ?? 0) / 600, 0), 1);
          const radius = 3 + altitudeFactor * 1.7;

          const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 3);
          glow.addColorStop(0, 'rgba(0, 255, 255, 0.65)');
          glow.addColorStop(1, 'rgba(0, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius * 2.4, 0, Math.PI * 2);
          ctx.fill();

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
    setIsReady(true);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointerleave', handleUp);
    };
  }, [drawFrame]);

  return (
    <div className="globe-canvas-container">
      <canvas ref={canvasRef} aria-label="Satellite globe visualization" />
      {!isReady && <div className="globe-loading">Loading globe…</div>}
    </div>
  );
}
