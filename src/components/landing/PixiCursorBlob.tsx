import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export function PixiCursorBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

  useEffect(() => {
    if (isMobile || !canvasRef.current) return;
    let app: PIXI.Application | null = null;
    try {
      app = new PIXI.Application({
        view: canvasRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        transparent: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
    } catch (e) {
      // PixiJS failed, do not block UI
      console.error("PixiJS initialization failed", e);
      return;
    }

    let blob = new PIXI.Graphics();
    app.stage.addChild(blob);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX;
    let lastY = mouseY;
    let idle = false;
    let idleTimeout: any;
    let isMagnetic = false;
    let magneticTarget: HTMLElement | null = null;
    let magneticRect = { x: 0, y: 0, w: 0, h: 0 };

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      idle = false;
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        idle = true;
      }, 150);
    }
    window.addEventListener("mousemove", onMove);

    function onMouseOver(e: MouseEvent) {
      let el = e.target as HTMLElement;
      if (el.closest("button, a, .magnetic")) {
        magneticTarget = el.closest("button, a, .magnetic") as HTMLElement;
        const rect = magneticTarget.getBoundingClientRect();
        magneticRect = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: rect.width,
          h: rect.height,
        };
        isMagnetic = true;
      }
    }
    function onMouseOut(e: MouseEvent) {
      if (isMagnetic) {
        isMagnetic = false;
        magneticTarget = null;
      }
    }
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    function resize() {
      if (!app) return;
      app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", resize);

    app.ticker.add(() => {
      blob.clear();
      if (idle) return;
      let dx = mouseX - lastX;
      let dy = mouseY - lastY;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx);
      let radiusX = isMagnetic ? magneticRect.w / 2 + 18 : 60 + dist * 0.7;
      let radiusY = isMagnetic ? magneticRect.h / 2 + 18 : 60 - dist * 0.2;
      let drawX = isMagnetic ? magneticRect.x : lastX;
      let drawY = isMagnetic ? magneticRect.y : lastY;
      blob.beginFill(0x2ecc71, 0.18); // green water color
      blob.pivot.set(0, 0);
      blob.position.set(0, 0);
      blob.drawEllipse(drawX, drawY, radiusX, radiusY);
      blob.endFill();
      lastX += (mouseX - lastX) * (isMagnetic ? 0.22 : 0.18);
      lastY += (mouseY - lastY) * (isMagnetic ? 0.22 : 0.18);
    });

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (app) app.destroy(true, { children: true });
      document.body.style.cursor = "";
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      id="cursor-trail"
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        background: "none",
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
} 