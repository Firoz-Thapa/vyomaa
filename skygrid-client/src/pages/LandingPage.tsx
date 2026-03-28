import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import Features from '../components/Features/Features';
import Orbit from '../components/Orbit/Orbit';
import Terminal from '../components/Terminal/Terminal';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Orbit />
      <Terminal />
      <CTA />
      <Footer />
    </>
  );
}
