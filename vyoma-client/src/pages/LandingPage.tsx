import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import Features from '../components/Features/Features';
import About from '../components/About/About';
import Orbit from '../components/Orbit/Orbit';
import Terminal from '../components/Terminal/Terminal';
import Docs from '../components/Docs/Docs';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('vyoma-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vyoma-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Stats />
      <Features />
      <About />
      <Orbit />
      <Terminal />
      <Docs />
      <CTA />
      <Footer />
    </>
  );
}
