"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle pool: mix of Stark red, cosmic gold, and arc cyan embers
    const particleCount = Math.min(width > 768 ? 60 : 30, 80);
    const colors = [
      "rgba(226, 54, 54, ", // Stark Red
      "rgba(245, 158, 11, ", // Gold
      "rgba(56, 189, 248, ", // Arc Cyan
      "rgba(255, 255, 255, ", // Star white
    ];

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.6 + 0.2), // float upward like embers
      speedX: (Math.random() - 0.5) * 0.4,
      colorPrefix: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      pulseDir: 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Pulse alpha
        p.alpha += p.pulse * p.pulseDir;
        if (p.alpha > 0.85) p.pulseDir = -1;
        if (p.alpha < 0.15) p.pulseDir = 1;

        // Wrap around screen
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = `${p.colorPrefix}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
