/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

export const BackgroundSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 100 Purple style particles configuration
    const particleCount = 100;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7, // Slow, elegant floating motion
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
      });
    }

    const draw = () => {
      // Dynamic active check to avoid visual stretching/pulling during shifts
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
        width = canvas.width = currentWidth;
        height = canvas.height = currentHeight;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw purple connecting lines between close particles
      const maxDistance = 100;
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35; // Bright purple connections
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`; // Purple lines (#a855f7)
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw and update purple particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192, 132, 252, 0.9)'; // Bright aesthetic purple
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset to avoid slowing down rendering

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Bounce/Wrap boundaries elegantly across full screen dimensions
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
      {/* Royal Dark Vignette backing */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/80 z-1" />
      
      {/* Dynamic Purple Canvas Particle System - 100 particles & purple lines */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-2 opacity-95" />

      {/* Atmospheric bottom golden/purple fog glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#12061c]/15 to-transparent blur-3xl z-3" />

      {/* Luxury purple nebular circular light masks to set the vibe */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,transparent_70%)] blur-[100px] animated-pulse-slow z-3" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,_rgba(216,180,254,0.06)_0%,transparent_60%)] blur-[80px] z-3" />
    </div>
  );
};
