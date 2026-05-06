import React from "react";

export function GlobalStyles() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;700&family=Permanent+Marker&display=swap');

        :root {
          --c-bg: #fffbf0;
          --c-ink: #101010;
          --c-lime: #ccff00;
          --c-purple: #b084ff;
          --c-orange: #ff5e00;
        }

        body {
          background-color: var(--c-bg);
          color: var(--c-ink);
          font-family: 'Space Grotesk', 'Cairo', sans-serif;
          overflow-x: hidden;
        }

        .font-marker {
          font-family: 'Permanent Marker', cursive;
        }

        .noise {
          position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .wobble-border {
          position: relative;
        }
        .wobble-border::before {
          content: ''; position: absolute; inset: -3px;
          background: transparent; border: 3px solid var(--c-ink);
          z-index: -1; filter: url(#rough-edges);
          transition: all 0.3s ease;
        }
        .wobble-fill::before {
          background: var(--c-lime);
        }

        .text-outline {
          -webkit-text-stroke: 2px var(--c-ink);
          color: transparent;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes gem-burst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: scale(1.5) rotate(360deg) translate(var(--tx), var(--ty)); opacity: 0; }
        }

        @keyframes gem-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .gem-animation-particle {
          position: absolute;
          animation: gem-burst 1s ease-out forwards;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes drawer-slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes drawer-slide-in-rtl {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .drawer-animate {
          animation: drawer-slide-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .drawer-animate-rtl {
          animation: drawer-slide-in-rtl 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes glitch-flicker {
          0% { opacity: 0.1; transform: skewX(0deg); }
          5% { opacity: 0.4; transform: skewX(2deg); }
          10% { opacity: 0.1; transform: skewX(-2deg); }
          15% { opacity: 0.3; transform: skewX(0deg); }
          100% { opacity: 0.1; }
        }

        @keyframes hud-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.02); opacity: 1; }
        }

        .hud-scanline {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(204, 255, 0, 0.05), transparent);
          background-size: 100% 20px;
          animation: scanline 8s linear infinite;
        }

        .hud-grid {
          background-image: radial-gradient(var(--c-lime) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.05;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid var(--c-lime);
          animation: typing 1s steps(40, end), blink-caret 0.75s step-end infinite;
        }

        @keyframes cyber-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        .animate-cyber-float {
          animation: cyber-float 3s ease-in-out infinite;
        }

        @keyframes glitch-btn {
          0% { clip-path: inset(0 0 0 0); transform: translate(0); }
          20% { clip-path: inset(20% -5px 60% 0); transform: translate(-5px, 5px); }
          40% { clip-path: inset(50% 5px 30% 0); transform: translate(5px, -5px); }
          60% { clip-path: inset(10% -5px 80% 0); transform: translate(-5px, 5px); }
          80% { clip-path: inset(80% 5px 5% 0); transform: translate(5px, -5px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }

        .glitch-hover:hover {
          animation: glitch-btn 0.3s linear infinite;
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: var(--c-lime); }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
          white-space: nowrap;
          display: inline-flex;
          gap: 3rem;
        }

        @keyframes border-flow {
          0% { border-color: var(--c-lime); }
          33% { border-color: var(--c-orange); }
          66% { border-color: var(--c-purple); }
          100% { border-color: var(--c-lime); }
        }

        .border-flow {
          animation: border-flow 3s linear infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(204, 255, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(204, 255, 0, 0.8), 0 0 80px rgba(204, 255, 0, 0.3); }
        }

        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>

      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="rough-edges">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>
    </>
  );
}
