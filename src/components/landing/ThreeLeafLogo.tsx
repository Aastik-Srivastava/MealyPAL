import React from 'react';

interface ThreeLeafLogoProps {
  className?: string;
  size?: number;
}

export const ThreeLeafLogo: React.FC<ThreeLeafLogoProps> = ({ 
  className = "", 
  size = 48 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central leaf pointing upwards */}
      <path
        d="M24 4C24 4 20 8 20 16C20 24 24 28 24 28C24 28 28 24 28 16C28 8 24 4 24 4Z"
        fill="url(#centralLeafGradient)"
      />
      
      {/* Left leaf */}
      <path
        d="M16 20C16 20 12 24 12 32C12 40 16 44 16 44C16 44 20 40 20 32C20 24 16 20 16 20Z"
        fill="url(#leftLeafGradient)"
        transform="rotate(-15 16 32)"
      />
      
      {/* Right leaf */}
      <path
        d="M32 20C32 20 36 24 36 32C36 40 32 44 32 44C32 44 28 40 28 32C28 24 32 20 32 20Z"
        fill="url(#rightLeafGradient)"
        transform="rotate(15 32 32)"
      />
      
      {/* Stem */}
      <path
        d="M23 44L25 44L25 48L23 48Z"
        fill="#1a4d1a"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="centralLeafGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d5a2d" />
          <stop offset="100%" stopColor="#A8FFBA" />
        </linearGradient>
        <linearGradient id="leftLeafGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d5a2d" />
          <stop offset="100%" stopColor="#A8FFBA" />
        </linearGradient>
        <linearGradient id="rightLeafGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d5a2d" />
          <stop offset="100%" stopColor="#A8FFBA" />
        </linearGradient>
      </defs>
    </svg>
  );
}; 