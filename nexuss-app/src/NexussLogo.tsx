import React from 'react';

interface NexussLogoProps {
  size?: number;
  showWordmark?: boolean;
}

export const NexussLogo: React.FC<NexussLogoProps> = ({
  size = 34,
  showWordmark = true,
}) => {
  return (
    <div className="nexuss-logo-wrap">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="nexuss-logo-svg"
        aria-label="Nexuss AI Logo"
      >
        <defs>
          <linearGradient
            id="nx-frame"
            x1="4"
            y1="4"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient
            id="nx-ribbon"
            x1="34"
            y1="6"
            x2="8"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* Isometric Outer Hexagon */}
        <path
          d="M20 3.5L34.2894 11.75V28.25L20 36.5L5.71058 28.25V11.75L20 3.5Z"
          stroke="url(#nx-frame)"
          strokeWidth="2.2"
          strokeOpacity="0.55"
        />

        {/* Interlocking "N" Neural Ribbon */}
        <path
          d="M12.5 28V12.5L27.5 27.5V12"
          stroke="url(#nx-ribbon)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Connected Nodes */}
        <circle cx="12.5" cy="12.5" r="2.6" fill="#A78BFA" />
        <circle cx="27.5" cy="27.5" r="2.6" fill="#60A5FA" />
        <circle cx="12.5" cy="28" r="2" fill="#3B82F6" />
        <circle cx="27.5" cy="12" r="2" fill="#8B5CF6" />
        <circle cx="20" cy="20" r="2.4" fill="#FFFFFF" />
      </svg>

      {showWordmark && (
        <div className="nexuss-wordmark">
          <span className="nexuss-brand-text">NEXUSS</span>
          <span className="nexuss-ai-badge">AI</span>
        </div>
      )}
    </div>
  );
};