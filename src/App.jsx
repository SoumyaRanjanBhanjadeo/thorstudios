import { useCallback, useEffect, useState } from "react";
import { useDevice } from "./animations/useDevice";
import { useSmoothScroll } from "./animations/useSmoothScroll";
import { useScrollScene } from "./animations/useScrollScene";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import GrainOverlay from "./components/GrainOverlay";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import Statement from "./sections/Statement";
import Stats from "./sections/Stats";
import Testimonials from "./sections/Testimonials";
import Clients from "./sections/Clients";
import Contact from "./sections/Contact";
import CookieBanner from "./components/CookieBanner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);
  const device = useDevice();

  useSmoothScroll(ready && !device.reducedMotion);
  useScrollScene({
    reducedMotion: device.reducedMotion,
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    ready,
  });

  const onLoaded = useCallback(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    if (!ready) return undefined;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [ready]);

  return (
    <div className="relative min-h-full bg-bg">
      {!ready && <LoadingScreen onComplete={onLoaded} />}
      <GrainOverlay />

      <a
        className="absolute left-4 -top-16 z-80 bg-ink px-4 py-2.5 text-bg"
        href="#top"
      >
        Skip to content
      </a>
      {ready && (
        <>
          <Navbar ready={ready} />
          <main className="relative bg-bg">
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <Statement />
            <Stats />
            <Testimonials />
            <Clients />
            <Contact />
          </main>
          <Footer />
        </>
      )}
      <CookieBanner />
    </div>
  );
}
