import React, { useRef, useEffect, useState } from "react";

// Utility for smooth animation
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface LiquidFillMeterProps {
  consumed: number;
  goal: number;
  width?: number;
  height?: number;
  waveColor?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  glowColor?: string;
  blur?: number;
  renderText?: (args: { consumed: number; goal: number; percent: number }) => React.ReactNode;
  liquidGradientId?: string;
  liquidStops?: Array<{ offset: string; color: string; opacity?: number }>;
}

const LiquidFillMeter: React.FC<LiquidFillMeterProps> = ({
  consumed,
  goal,
  width = 240,
  height = 240,
  waveColor = "#ae7fe2",
  bgColor = "rgba(255,255,255,0.10)",
  borderColor = "#7cfb8b33",
  textColor = "#fff",
  glowColor = "#7cfb8b88",
  blur = 16,
  renderText,
  liquidGradientId,
  liquidStops,
}) => {
  const percent = Math.min(1, goal > 0 ? consumed / goal : 0);
  const [animatedPercent, setAnimatedPercent] = useState(percent);
  const requestRef = useRef<number>();

  // Animate percent
  useEffect(() => {
    let frame: number;
    function animate() {
      setAnimatedPercent((prev) => {
        if (Math.abs(prev - percent) < 0.001) return percent;
        return lerp(prev, percent, 0.08);
      });
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  // Wave animation
  const [wavePhase, setWavePhase] = useState(0);
  useEffect(() => {
    let frame: number;
    function animate() {
      setWavePhase((p) => p + 0.04);
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // SVG dimensions
  const r = width / 2 - 12;
  const cx = width / 2;
  const cy = height / 2;
  const waveHeight = 10;
  const waveLength = width * 0.9;

  // Generate wave path
  function getWavePath(phase: number, fillPercent: number) {
    const points = [];
    const waveCount = 2;
    for (let x = 0; x <= width; x += 2) {
      const theta = ((x / waveLength) * Math.PI * 2 * waveCount) + phase;
      const y =
        cy +
        r -
        fillPercent * 2 * r +
        Math.sin(theta) * waveHeight * (1 - fillPercent);
      points.push(`${x},${y}`);
    }
    // Close the path
    return `M0,${height} L${points.join(" ")} L${width},${height} Z`;
  }

  // Format numbers
  const format = (n: number) => n.toLocaleString();

  const gradientId = liquidGradientId || "liquid";
  const stops = liquidStops || [
    { offset: "0%", color: "#7cfb8b", opacity: 0.95 },
    { offset: "100%", color: "#45ffaf", opacity: 0.85 },
  ];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width,
        height,
        borderRadius: "50%",
        background: bgColor,
        boxShadow: `0 4px 32px 0 ${glowColor}`,
        backdropFilter: `blur(${blur}px)`,
        border: `2px solid ${borderColor}`,
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ display: "block", position: "absolute", top: 0, left: 0 }}
      >
        {/* Glassy background */}
        <defs>
          <radialGradient id="glass-bg" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7cfb8b" stopOpacity="0.04" />
          </radialGradient>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            {stops.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity ?? 1} />
            ))}
          </linearGradient>
          <filter id="liquid-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        {/* Glassy radial bg */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#glass-bg)"
          opacity="0.9"
        />
        {/* Animated liquid wave */}
        <path
          d={getWavePath(wavePhase, animatedPercent)}
          fill={`url(#${gradientId})`}
          filter="url(#liquid-blur)"
          style={{
            transition: "fill 0.3s",
            opacity: 0.95,
          }}
        />
        {/* Glow overlay */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={glowColor}
          strokeWidth="8"
          opacity="0.18"
        />
        {/* Outer border */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={borderColor}
          strokeWidth="2.5"
          opacity="0.7"
        />
      </svg>
      {/* Centered text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center select-none"
        style={{
          color: textColor,
          textShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        {typeof renderText === 'function' ? (
          renderText({
            consumed: Math.round(animatedPercent * goal),
            goal: goal,
            percent: Math.round(animatedPercent * 100),
          })
        ) : (
          <>
            <span className="text-3xl md:text-4xl font-extrabold" style={{ color: "#7cfb8b" }}>
              {format(Math.round(animatedPercent * goal))} kcal
            </span>
            <span className="text-lg font-medium mt-1" style={{ color: "#fff" }}>
              / {format(goal)} kcal
            </span>
            <span className="text-base font-semibold mt-2" style={{ color: "#7cfb8b" }}>
              {Math.round(animatedPercent * 100)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default LiquidFillMeter; 