import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";

interface ProgressRingProps {
  consumed: number;
  goal: number;
  className?: string;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ consumed, goal, className }) => {
  // Animated value for smooth transitions
  const [animatedValue, setAnimatedValue] = useState(consumed);
  const [animatedPercent, setAnimatedPercent] = useState(goal > 0 ? (consumed / goal) * 100 : 0);
  const prevValue = useRef(consumed);
  const prevPercent = useRef(animatedPercent);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 900;
    const from = prevValue.current;
    const to = consumed;
    const fromPercent = prevPercent.current;
    const toPercent = goal > 0 ? (consumed / goal) * 100 : 0;
    function animate(ts: number) {
      if (start === null) start = ts;
      const progress = clamp((ts - start) / duration, 0, 1);
      setAnimatedValue(from + (to - from) * progress);
      setAnimatedPercent(fromPercent + (toPercent - fromPercent) * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setAnimatedValue(to);
        setAnimatedPercent(toPercent);
        prevValue.current = to;
        prevPercent.current = toPercent;
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [consumed, goal]);

  // Ring geometry
  const size = 180;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = clamp(goal > 0 ? animatedValue / goal : 0, 0, 1);
  const arc = circumference * percent;
  const arcTipAngle = percent * 360 - 90;
  const arcTipRadians = (arcTipAngle * Math.PI) / 180;
  const arcTipX = size / 2 + radius * Math.cos(arcTipRadians);
  const arcTipY = size / 2 + radius * Math.sin(arcTipRadians);

  // Animate gradient rotation
  const [gradientAngle, setGradientAngle] = useState(0);
  useEffect(() => {
    let raf: number;
    function tick() {
      setGradientAngle((a) => (a + 1.2) % 360);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Responsive size
  const ringSize = "w-[180px] h-[180px] md:w-[220px] md:h-[220px]";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "bg-white/10 backdrop-blur-2xl rounded-full shadow-2xl border border-[#A8FFBA]/20",
        "p-4",
        ringSize,
        className
      )}
      style={{ width: size, height: size }}
      aria-label={`Calories consumed: ${consumed} of ${goal}`}
      role="img"
    >
      {/* Offset radial glow/blur (not behind text) */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          left: "-30px",
          top: "30px",
          width: "120%",
          height: "120%",
          filter: "blur(32px) saturate(1.2)",
          opacity: 0.45,
          background: "radial-gradient(ellipse 60% 40% at 30% 70%, #A8FFBA 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        className="relative z-10"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#22292f"
          strokeWidth={stroke}
          opacity={0.32}
        />
        {/* Animated gradient progress arc */}
        <defs>
          <linearGradient
            id="progress-gradient"
            gradientTransform={`rotate(${gradientAngle} ${size / 2} ${size / 2})`}
            x1="0%" y1="0%" x2="100%" y2="0%"
          >
            <stop offset="0%" stopColor="#A8FFBA" />
            <stop offset="40%" stopColor="#51B73B" />
            <stop offset="100%" stopColor="#A8FFBA" />
          </linearGradient>
          <radialGradient id="tip-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8FFBA" stopOpacity="1" />
            <stop offset="100%" stopColor="#A8FFBA" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - arc}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 16px #A8FFBA88)",
            transition: "stroke-dashoffset 0.5s cubic-bezier(.4,2,.6,1)",
          }}
        />
        {/* Pulsing glow at arc tip */}
        {percent > 0.01 && percent < 1 && (
          <circle
            cx={arcTipX}
            cy={arcTipY}
            r={stroke / 1.7 + 2 * (0.5 + 0.5 * Math.sin(Date.now() / 350))}
            fill="url(#tip-glow)"
            opacity={0.85}
            style={{ filter: "blur(4px)", transition: "r 0.2s" }}
          />
        )}
      </svg>
      {/* Center text: animated % and kcal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 select-none">
        <span className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight drop-shadow-lg">
          {Math.round(animatedPercent)}%
        </span>
        <span className="text-lg text-[#A8FFBA] font-semibold mt-1 drop-shadow">
          {Math.round(animatedValue)} kcal — {Math.round(animatedPercent)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing; 