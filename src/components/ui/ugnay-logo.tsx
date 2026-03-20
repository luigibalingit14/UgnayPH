"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register the React plugin for Next.js app router safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function UgnayLogo({ className = "w-10 h-10" }: { className?: string }) {
  const container = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    // 1. Initial entrance scale/fade
    gsap.from(container.current, {
      scale: 0.6,
      opacity: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.4)"
    });

    // 2. Continuous Sun Ray Rotation
    gsap.to(".logo-rays", {
      rotation: 360,
      transformOrigin: "50px 50px",
      duration: 25,
      repeat: -1,
      ease: "none"
    });

    // 3. Pulsing Core 
    gsap.to(".logo-core", {
      scale: 1.05,
      transformOrigin: "50px 50px",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 4. Staggered Node Twinkling
    gsap.to(".logo-node", {
      opacity: 0.5,
      scale: 0.8,
      transformOrigin: "center center",
      duration: 1,
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true,
      },
      ease: "power1.inOut"
    });

    // 5. Network lines energy flow
    // Using simple strokeDashoffset animation to simulate data flowing
    gsap.to(".logo-line", {
      strokeDashoffset: -20,
      duration: 1.5,
      repeat: -1,
      ease: "none"
    });

  }, { scope: container });

  return (
    <svg 
      ref={container}
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-glow-blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#60a5fa" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="node-glow-red" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#f87171" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="node-glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#fde047" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Network Connectors */}
      <g strokeOpacity="0.7" strokeWidth="1.5">
        <path className="logo-line" d="M50 15 L20 32 L20 68 L50 85 M50 50 L20 32 M50 50 L20 68 L50 85" stroke="#60a5fa" strokeDasharray="4 4" />
        <line className="logo-line" x1="50" y1="50" x2="50" y2="15" stroke="#60a5fa" strokeDasharray="4 4" />
        
        <path className="logo-line" d="M50 15 L80 32 L80 68 L50 85 M50 50 L80 32 M50 50 L80 68" stroke="#f87171" strokeDasharray="4 4" />
        <line className="logo-line" x1="50" y1="50" x2="80" y2="68" stroke="#fde047" strokeDasharray="4 4" />
        <line className="logo-line" x1="20" y1="32" x2="50" y2="50" stroke="#fde047" strokeDasharray="4 4" />
      </g>

      {/* Central Sun */}
      <g filter="url(#sun-glow)">
        <circle className="logo-core" cx="50" cy="50" r="13" fill="#fbbf24" />
        <circle className="logo-core" cx="50" cy="50" r="9" fill="#fde047" />
        {/* 8 Sun Rays */}
        <g className="logo-rays" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round">
          {/* Cardinal */}
          <line x1="50" y1="30" x2="50" y2="20" />
          <line x1="50" y1="70" x2="50" y2="80" />
          <line x1="30" y1="50" x2="20" y2="50" />
          <line x1="70" y1="50" x2="80" y2="50" />
          {/* Ordinal */}
          <line x1="36" y1="36" x2="29" y2="29" />
          <line x1="64" y1="64" x2="71" y2="71" />
          <line x1="64" y1="36" x2="71" y2="29" />
          <line x1="36" y1="64" x2="29" y2="71" />
        </g>
      </g>

      {/* Circuit Nodes (The 6 points of the hexagon) */}
      <circle className="logo-node" cx="50" cy="15" r="4" fill="#eff6ff" filter="url(#node-glow-blue)" />
      <circle className="logo-node" cx="80" cy="32" r="4" fill="#fef2f2" filter="url(#node-glow-red)" />
      <circle className="logo-node" cx="80" cy="68" r="4" fill="#fefce8" filter="url(#node-glow-yellow)" />
      <circle className="logo-node" cx="50" cy="85" r="4" fill="#fef2f2" filter="url(#node-glow-red)" />
      <circle className="logo-node" cx="20" cy="68" r="4" fill="#eff6ff" filter="url(#node-glow-blue)" />
      <circle className="logo-node" cx="20" cy="32" r="4" fill="#eff6ff" filter="url(#node-glow-blue)" />
      
      {/* Central node connection points */}
      <circle className="logo-core" cx="50" cy="50" r="2" fill="#fff" />
    </svg>
  );
}
