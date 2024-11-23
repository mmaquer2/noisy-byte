

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-8 w-8" }: LogoProps) => {
  return (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
 
  <defs>
    <pattern id="wave-noise" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
      <path d="M0 5 Q 5 0, 10 5 Q 15 10, 20 5" stroke="#3498db" fill="none" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="d" 
                 values="M0 5 Q 5 0, 10 5 Q 15 10, 20 5;
                        M0 5 Q 5 10, 10 5 Q 15 0, 20 5;
                        M0 5 Q 5 0, 10 5 Q 15 10, 20 5" 
                 dur="4s" 
                 repeatCount="indefinite"/>
      </path>
    </pattern>
  </defs>
  

  <rect x="20" y="20" width="160" height="60" rx="10" fill="#2c3e50"/>
  
 
  <rect x="20" y="20" width="160" height="60" rx="10" fill="url(#wave-noise)"/>
  

  <text x="30" y="35" font-family="monospace" font-size="8" fill="#3498db">10110011</text>
  <text x="140" y="75" font-family="monospace" font-size="8" fill="#3498db">01001010</text>
    

  <text x="100" y="58" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">NoisyByte</text>
  

  <rect x="20" y="45" width="160" height="2" fill="#3498db" opacity="0.6">
    <animate attributeName="y" values="45;48;45" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite"/>
  </rect>
  
  <path d="M 20 50 Q 60 40, 100 50 Q 140 60, 180 50" 
        stroke="#3498db" 
        fill="none" 
        strokeWidth="1" 
        opacity="0.3">
    <animate attributeName="d" 
             values="M 20 50 Q 60 40, 100 50 Q 140 60, 180 50;
                    M 20 50 Q 60 60, 100 50 Q 140 40, 180 50;
                    M 20 50 Q 60 40, 100 50 Q 140 60, 180 50" 
             dur="3s" 
             repeatCount="indefinite"/>
  </path>
</svg>
  );
};

export default Logo;