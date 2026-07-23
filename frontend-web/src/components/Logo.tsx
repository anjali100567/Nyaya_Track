import React from 'react';

import { Scale } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 90, className = '' }) => {
  return (
    <div className={`logo-container ${className}`} style={{ 
      width: size, 
      height: size, 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: '0 auto 20px'
    }}>
      {/* Golden Laurel Wreath SVG (Open at top) */}
      <svg 
        viewBox="0 0 100 100" 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        fill="none" 
        stroke="var(--brass-gold)" 
        strokeWidth="2"
      >
        {/* Left branch */}
        <path d="M 50 95 C 15 90, 5 35, 25 15" strokeLinecap="round"/>
        {/* Left leaves */}
        <path d="M 40 85 Q 20 70, 22 55 Q 32 65, 40 85" fill="var(--brass-gold)"/>
        <path d="M 28 62 Q 10 45, 15 30 Q 25 40, 28 62" fill="var(--brass-gold)"/>
        <path d="M 20 38 Q 5 25, 12 15 Q 22 22, 20 38" fill="var(--brass-gold)"/>
        
        {/* Right branch */}
        <path d="M 50 95 C 85 90, 95 35, 75 15" strokeLinecap="round"/>
        {/* Right leaves */}
        <path d="M 60 85 Q 80 70, 78 55 Q 68 65, 60 85" fill="var(--brass-gold)"/>
        <path d="M 72 62 Q 90 45, 85 30 Q 75 40, 72 62" fill="var(--brass-gold)"/>
        <path d="M 80 38 Q 95 25, 88 15 Q 78 22, 80 38" fill="var(--brass-gold)"/>
        
        {/* Shield */}
        <path d="M 50 12 L 78 22 L 78 55 C 78 78, 50 90, 50 90 C 50 90, 22 78, 22 55 L 22 22 Z" 
              fill="var(--citizen-green)" 
              stroke="var(--brass-gold)" 
              strokeWidth="2.5" />
        {/* Inner Shield Border */}
        <path d="M 50 16 L 73 25 L 73 53 C 73 72, 50 83, 50 83 C 50 83, 27 72, 27 53 L 27 25 Z" 
              fill="none" 
              stroke="var(--brass-gold)" 
              strokeWidth="1" />
      </svg>
      
      {/* Scale Icon */}
      <Scale size={size * 0.35} color="var(--brass-gold)" style={{ zIndex: 10, marginTop: '-5%' }} />
    </div>
  );
};

export default Logo;
