export default function Seal({ size = 80 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      {/* Outer gold ring */}
      <circle cx="100" cy="100" r="96" fill="#1a3a6b" stroke="#c9a227" strokeWidth="4" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#c9a227" strokeWidth="1.5" />

      {/* Red ring */}
      <circle cx="100" cy="100" r="82" fill="#0b1f3a" stroke="#8b1a2b" strokeWidth="3" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="#8b1a2b" strokeWidth="0.5" />

      {/* Inner field */}
      <circle cx="100" cy="100" r="74" fill="#f5f0df" />

      {/* Top arc text - DEPARTMENT OF JUSTICE */}
      <defs>
        <path id="topArc" d="M 30,100 a 70,70 0 0,1 140,0" fill="none" />
        <path id="botArc" d="M 32,108 a 68,68 0 0,0 136,0" fill="none" />
      </defs>
      <text fill="#0b1f3a" fontSize="10" fontWeight="700" letterSpacing="2">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          • FEDERAL BUREAU OF INVESTIGATION •
        </textPath>
      </text>
      <text fill="#8b1a2b" fontSize="7.5" fontWeight="600" letterSpacing="1.8">
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">
          FRAUD &amp; FUNDS RECOVERY DIVISION
        </textPath>
      </text>

      {/* Center Shield */}
      <g>
        <path
          d="M 100 50 L 130 62 L 130 92 C 130 115 115 132 100 142 C 85 132 70 115 70 92 L 70 62 Z"
          fill="#0b1f3a"
          stroke="#c9a227"
          strokeWidth="2"
        />
        {/* Shield inner */}
        <path
          d="M 100 58 L 123 67 L 123 92 C 123 111 111 126 100 134 C 89 126 77 111 77 92 L 77 67 Z"
          fill="#8b1a2b"
        />
        {/* Star on shield */}
        <polygon
          points="100,74 104.5,84.5 116,86 107.5,94 110,105.5 100,99.5 90,105.5 92.5,94 84,86 95.5,84.5"
          fill="#f5f0df"
          stroke="#c9a227"
          strokeWidth="0.7"
        />
        {/* Scales of justice under star */}
        <g stroke="#f5f0df" strokeWidth="1.2" fill="none">
          <line x1="100" y1="108" x2="100" y2="120" />
          <line x1="85" y1="112" x2="115" y2="112" />
          <path d="M 82 112 Q 85 120 88 112" fill="#f5f0df" />
          <path d="M 112 112 Q 115 120 118 112" fill="#f5f0df" />
        </g>
      </g>

      {/* Est. date */}
      <text x="100" y="165" textAnchor="middle" fill="#0b1f3a" fontSize="8" fontWeight="700" letterSpacing="1">
        EST. 1908
      </text>
      <text x="100" y="175" textAnchor="middle" fill="#8b1a2b" fontSize="6.5" fontWeight="600" letterSpacing="1">
        MC COLLINS UNIT
      </text>
    </svg>
  );
}
