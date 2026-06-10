import React from 'react';

const Logo = ({ className = "h-9", textClassName = "text-xl font-black", forceWhite = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Premium SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        className="w-9 h-9 drop-shadow-md flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="buyzaarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0084D6" />
            <stop offset="100%" stopColor="#00c6ff" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow */}
        <circle cx="50" cy="50" r="45" fill="url(#buyzaarGrad)" opacity="0.1" />

        {/* Shopping bag handle */}
        <path
          d="M35 38V28C35 19.7157 41.7157 13 50 13C58.2843 13 65 19.7157 65 28V38"
          stroke="url(#buyzaarGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Main bag body */}
        <rect
          x="18"
          y="34"
          width="64"
          height="54"
          rx="16"
          fill="url(#buyzaarGrad)"
          stroke="white"
          strokeWidth="2"
        />

        {/* Stylized 'B' and smile shape inside bag */}
        <path
          d="M40 48H52C55 48 57.5 50.2 57.5 53C57.5 55.8 55 58 52 58H40"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 58H54C57 58 59.5 60.2 59.5 63C59.5 65.8 57 68 54 68H40"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 48V68"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Text */}
      <span className={`${textClassName} tracking-tight ${forceWhite ? 'text-white' : 'text-secondary dark:text-white'}`}>
        Buy<span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">zaar</span>
      </span>
    </div>
  );
};

export default Logo;
