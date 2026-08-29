import React from 'react';

interface ButterflyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'wine' | 'gold' | 'white';
}

export const ButterflyLogo: React.FC<ButterflyLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'wine' 
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorMap = {
    wine: {
      wing1: 'fill-[#722F37]',
      wing2: 'fill-[#8B1E3F]',
      accent: 'fill-[#D4AF37]',
      stroke: '#541221'
    },
    gold: {
      wing1: 'fill-[#D4AF37]',
      wing2: 'fill-[#E5C158]',
      accent: 'fill-[#722F37]',
      stroke: '#997A15'
    },
    white: {
      wing1: 'fill-white',
      wing2: 'fill-stone-200',
      accent: 'fill-[#D4AF37]',
      stroke: '#ffffff'
    }
  };

  const colors = colorMap[variant];

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeMap[size]} ${className} transition-transform duration-300 hover:scale-105 inline-block drop-shadow-sm`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wineGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E2A2B" />
          <stop offset="50%" stopColor="#722F37" />
          <stop offset="100%" stopColor="#4A0E17" />
        </linearGradient>
        <linearGradient id="wineGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B1E3F" />
          <stop offset="50%" stopColor="#722F37" />
          <stop offset="100%" stopColor="#3F0C13" />
        </linearGradient>
        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>

      {/* Left Upper Wing */}
      <path 
        d="M 50 48 C 42 30, 20 18, 12 30 C 5 40, 10 58, 25 64 C 38 68, 48 55, 50 48 Z" 
        fill="url(#wineGradLeft)" 
        opacity="0.95"
      />
      {/* Left Lower Wing */}
      <path 
        d="M 49 53 C 40 58, 22 62, 20 74 C 18 84, 32 90, 42 80 C 47 74, 49 60, 49 53 Z" 
        fill="url(#wineGradLeft)" 
        opacity="0.88"
      />
      
      {/* Right Upper Wing */}
      <path 
        d="M 50 48 C 58 30, 80 18, 88 30 C 95 40, 90 58, 75 64 C 62 68, 52 55, 50 48 Z" 
        fill="url(#wineGradRight)" 
        opacity="0.95"
      />
      {/* Right Lower Wing */}
      <path 
        d="M 51 53 C 60 58, 78 62, 80 74 C 82 84, 68 90, 58 80 C 53 74, 51 60, 51 53 Z" 
        fill="url(#wineGradRight)" 
        opacity="0.88"
      />

      {/* Decorative Wing Filigree / Gold Accents */}
      <path 
        d="M 32 40 C 25 36, 18 42, 22 50 C 28 48, 32 45, 32 40 Z" 
        fill="url(#goldAccent)" 
        opacity="0.85"
      />
      <path 
        d="M 68 40 C 75 36, 82 42, 78 50 C 72 48, 68 45, 68 40 Z" 
        fill="url(#goldAccent)" 
        opacity="0.85"
      />
      <circle cx="30" cy="74" r="3" fill="url(#goldAccent)" opacity="0.9" />
      <circle cx="70" cy="74" r="3" fill="url(#goldAccent)" opacity="0.9" />

      {/* Antennae with delicate curls */}
      <path 
        d="M 48 38 C 45 28, 38 20, 32 22 C 29 23, 30 27, 34 26" 
        fill="none" 
        stroke="url(#goldAccent)" 
        strokeWidth="2.2" 
        strokeLinecap="round"
      />
      <path 
        d="M 52 38 C 55 28, 62 20, 68 22 C 71 23, 70 27, 66 26" 
        fill="none" 
        stroke="url(#goldAccent)" 
        strokeWidth="2.2" 
        strokeLinecap="round"
      />
      <circle cx="33" cy="24" r="1.5" fill="#D4AF37" />
      <circle cx="67" cy="24" r="1.5" fill="#D4AF37" />

      {/* Slender Body */}
      <ellipse cx="50" cy="56" rx="3" ry="16" fill="url(#goldAccent)" />
      <circle cx="50" cy="38" r="3.5" fill="#722F37" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  );
};
