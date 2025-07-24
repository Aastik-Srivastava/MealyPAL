import { useEffect, useRef } from "react";

export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    // Cursor state
    let mouse = { x: width / 2, y: height / 2 };
    let blob = { x: width / 2, y: height / 2 };
    let last = { x: width / 2, y: height / 2 };
    let speed = 0;
    let idle = false;
    let idleTimeout: any;
    let opacity = 1;

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      idle = false;
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        idle = true;
      }, 150);
    }
    window.addEventListener("mousemove", onMove);

    function animate() {
      // Springy follow
      blob.x += (mouse.x - blob.x) * 0.18;
      blob.y += (mouse.y - blob.y) * 0.18;
      speed = Math.sqrt((blob.x - last.x) ** 2 + (blob.y - last.y) ** 2);
      last.x = blob.x;
      last.y = blob.y;
      // Blob morphing
      let angle = Math.atan2(blob.y - mouse.y, blob.x - mouse.x);
      let stretch = Math.min(speed * 0.04, 1.2);
      let radiusX = 60 + stretch * 40;
      let radiusY = 60 - stretch * 18;
      // Fade out when idle, fade in when moving
      opacity += (idle ? 0 : 1) - opacity;
      opacity += (idle ? -0.08 : 0.12) * (idle ? 1 : 1);
      opacity = Math.max(0, Math.min(1, opacity));
      // Draw
      const ctx = canvas.getContext("2d");
      ctx!.clearRect(0, 0, width * dpr, height * dpr);
      if (opacity > 0.01) {
        ctx!.save();
        ctx!.scale(dpr, dpr);
        ctx!.filter = "blur(8px)";
        ctx!.globalAlpha = opacity;
        ctx!.translate(blob.x, blob.y);
        ctx!.rotate(angle);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(144,238,144,0.22)";
        ctx!.fill();
        ctx!.restore();
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40"
      aria-hidden="true"
      tabIndex={-1}
      style={{
        mixBlendMode: "screen",
        background: "none",
      }}
    />
  );
} 