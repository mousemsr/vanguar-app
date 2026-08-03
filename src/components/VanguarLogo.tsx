import React from 'react';

interface VanguarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const VanguarLogo: React.FC<VanguarLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div className={`inline-flex flex-col items-start justify-center select-none ${className}`}>
      <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 320 80"
          className="h-full w-auto filter drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for the V Arrow */}
            <linearGradient id="vanguarVGradient" x1="10" y1="70" x2="65" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="35%" stopColor="#2563eb" />
              <stop offset="70%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Gradient for the ANGUAR Text */}
            <linearGradient id="vanguarTextGradient" x1="80" y1="20" x2="310" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="40%" stopColor="#6366f1" />
              <stop offset="80%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Subtle inner stroke gradient */}
            <linearGradient id="vanguarStrokeGradient" x1="0" y1="0" x2="320" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Stylized 'V' with Arrow incorporated on right arm */}
          <g id="V-Symbol">
            {/* Left curved arm of V */}
            <path
              d="M 12 28 C 16 28 20 34 26 48 L 36 68 C 38 72 43 72 45 68 L 52 54 L 38 54 L 30 38 L 22 28 Z"
              fill="url(#vanguarVGradient)"
            />
            {/* Main Arrow Stem & Tip shooting up-right */}
            <path
              d="M 28 68 L 54 22 L 44 22 L 44 10 L 68 10 L 68 34 L 56 34 L 56 24 L 38 58 C 35 63 31 68 28 68 Z"
              fill="url(#vanguarVGradient)"
            />
            {/* Bold V overlay shape */}
            <path
              d="M 8 26 C 14 26 22 42 32 64 L 40 48 L 50 26 L 68 8 L 44 8 L 55 24 L 38 56 L 24 26 Z"
              fill="url(#vanguarVGradient)"
            />
          </g>

          {/* Lettering "ANGUAR" */}
          <text
            x="76"
            y="62"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="52"
            letterSpacing="2"
            fill="url(#vanguarTextGradient)"
            stroke="url(#vanguarStrokeGradient)"
            strokeWidth="0.75"
          >
            ANGUAR
          </text>
        </svg>
      </div>

      {showSubtitle && (
        <div className="flex items-center gap-2 pl-1 mt-0.5">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            BARBERÍA • MEDELLÍN
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};
