import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  GlobalStyles,
  Navbar,
  Hero,
  Marquee,
  Manifesto,
  ChaosServices,
  TeamScribbles,
  StickyWorks,
  RawStats,
  HomeCommunityTeaser,
  Footer,
  OnboardingTutorial,
} from "@/components/ControlledChaos";

export default function ControlledChaosPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <>
      <OnboardingTutorial />
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Manifesto />
      <StickyWorks />
      <HomeCommunityTeaser />
      <ChaosServices />
      <TeamScribbles />
      <RawStats />
      <Footer />
    </>
  );
}
