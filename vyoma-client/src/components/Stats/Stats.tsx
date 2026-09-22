import { useEffect, useRef, useState } from 'react';
import './Stats.css';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  duration: number;
}

const STATS: StatItem[] = [
  { target: 8247,   suffix: '',   label: 'Active Satellites',      duration: 1200 },
  { target: 124000, suffix: '',   label: 'Pass Predictions / Day', duration: 1400 },
  { target: 47,     suffix: '',   label: 'Ground Stations',        duration: 1000 },
  { target: 42,     suffix: 'ms', label: 'Data Latency',           duration: 800  },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(interval);
    }, duration / 60);
    return () => clearInterval(interval);
  }, [active, target, duration]);
  return value;
}

function StatCard({ stat }: { stat: StatItem }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const value = useCountUp(stat.target, stat.duration, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat" ref={ref}>
      <span className="stat-num">{value.toLocaleString()}{stat.suffix}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats-bar">
      {STATS.map(s => <StatCard key={s.label} stat={s} />)}
    </div>
  );
}
