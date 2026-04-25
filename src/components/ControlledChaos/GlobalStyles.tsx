import React from "react";

export function GlobalStyles() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Permanent+Marker&display=swap');

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
          font-family: 'Space Grotesk', sans-serif;
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
