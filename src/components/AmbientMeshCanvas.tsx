import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const AmbientMeshCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with easing
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Mesh orb points
    const orbs = [
      { x: width * 0.2, y: height * 0.3, radius: 350, vx: 0.4, vy: 0.3, colorDark: 'rgba(6, 182, 212, 0.18)', colorLight: 'rgba(6, 182, 212, 0.12)' },
      { x: width * 0.8, y: height * 0.2, radius: 400, vx: -0.3, vy: 0.5, colorDark: 'rgba(147, 51, 234, 0.18)', colorLight: 'rgba(168, 85, 247, 0.12)' },
      { x: width * 0.5, y: height * 0.7, radius: 450, vx: 0.5, vy: -0.4, colorDark: 'rgba(79, 70, 229, 0.15)', colorLight: 'rgba(99, 102, 241, 0.10)' },
      { x: width * 0.1, y: height * 0.8, radius: 300, vx: -0.2, vy: -0.3, colorDark: 'rgba(236, 72, 153, 0.12)', colorLight: 'rgba(244, 114, 182, 0.10)' },
    ];

    // Floating micro-particles
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.005;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // Draw Mesh Orbs
      orbs.forEach((orb, i) => {
        orb.x += orb.vx + Math.sin(time + i) * 0.5;
        orb.y += orb.vy + Math.cos(time + i) * 0.5;

        // Bounce
        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        // Radial Gradient
        const grad = ctx.createRadialGradient(
          orb.x + (mouse.x - width / 2) * 0.05 * (i + 1),
          orb.y + (mouse.y - height / 2) * 0.05 * (i + 1),
          0,
          orb.x,
          orb.y,
          orb.radius
        );

        const color = isDark ? orb.colorDark : orb.colorLight;
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mouse Spotlight Orb
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        300
      );
      mouseGrad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.15)');
      mouseGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 300, 0, Math.PI * 2);
      ctx.fill();

      // Render micro particles
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.4)';
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.globalAlpha = p.alpha * (isDark ? 0.7 : 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.95 }}
    />
  );
};
