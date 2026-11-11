/** Ilustração do login: campo visto de cima e cartões de painel flutuando. Usa `currentColor`, então segue o tema. */
export function ArteLogin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 400"
      role="img"
      aria-label="Campo de futebol com cartões de placar e estatísticas"
      className={className}
    >
      {/* campo */}
      <g fill="none" stroke="currentColor" strokeOpacity=".28" strokeWidth="2">
        <rect x="40" y="40" width="440" height="320" rx="18" />
        <line x1="260" y1="40" x2="260" y2="360" />
        <circle cx="260" cy="200" r="52" />
        <rect x="40" y="120" width="70" height="160" />
        <rect x="410" y="120" width="70" height="160" />
        <rect x="40" y="160" width="28" height="80" />
        <rect x="452" y="160" width="28" height="80" />
      </g>
      <circle cx="260" cy="200" r="4" fill="currentColor" fillOpacity=".35" />

      {/* cartão: placar ao vivo */}
      <g>
        <rect x="70" y="70" width="190" height="104" rx="14" fill="currentColor" fillOpacity=".16" />
        <rect
          x="70"
          y="70"
          width="190"
          height="104"
          rx="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".35"
        />
        <rect x="86" y="86" width="54" height="18" rx="9" fill="currentColor" fillOpacity=".9" />
        <text
          x="113"
          y="99"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          className="fill-brand"
        >
          AO VIVO
        </text>
        <circle cx="106" cy="138" r="14" fill="currentColor" fillOpacity=".4" />
        <circle cx="224" cy="138" r="14" fill="currentColor" fillOpacity=".25" />
        <text
          x="165"
          y="147"
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          fill="currentColor"
        >
          2 × 1
        </text>
        <text
          x="236"
          y="99"
          textAnchor="end"
          fontSize="11"
          fontFamily="Inter, sans-serif"
          fill="currentColor"
          fillOpacity=".7"
        >
          67&apos;
        </text>
      </g>

      {/* cartão: gráfico de barras */}
      <g>
        <rect x="290" y="96" width="170" height="112" rx="14" fill="currentColor" fillOpacity=".16" />
        <rect
          x="290"
          y="96"
          width="170"
          height="112"
          rx="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".35"
        />
        <rect x="306" y="110" width="60" height="7" rx="3.5" fill="currentColor" fillOpacity=".55" />
        {[34, 58, 44, 74, 52, 86].map((h, i) => (
          <rect
            key={i}
            x={308 + i * 24}
            y={194 - h}
            width="14"
            height={h}
            rx="4"
            fill="currentColor"
            fillOpacity={i === 5 ? 0.95 : 0.4}
          />
        ))}
      </g>

      {/* cartão: classificação */}
      <g>
        <rect x="100" y="224" width="200" height="110" rx="14" fill="currentColor" fillOpacity=".16" />
        <rect
          x="100"
          y="224"
          width="200"
          height="110"
          rx="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".35"
        />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <text
              x="116"
              y={256 + i * 28}
              fontSize="12"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
              fill="currentColor"
              fillOpacity=".8"
            >
              {i + 1}
            </text>
            <circle cx="148" cy={252 + i * 28} r="9" fill="currentColor" fillOpacity={0.5 - i * 0.1} />
            <rect
              x="166"
              y={247 + i * 28}
              width={72 - i * 12}
              height="8"
              rx="4"
              fill="currentColor"
              fillOpacity=".55"
            />
            <rect
              x="256"
              y={247 + i * 28}
              width="30"
              height="8"
              rx="4"
              fill="currentColor"
              fillOpacity=".85"
            />
          </g>
        ))}
      </g>

      {/* bola */}
      <g transform="translate(372 292)">
        <circle r="38" fill="currentColor" fillOpacity=".95" />
        <g className="fill-brand">
          <polygon points="0,-14 13,-4 8,12 -8,12 -13,-4" />
          <polygon points="0,-38 8,-26 -8,-26" opacity=".9" />
          <polygon points="36,-12 28,2 24,-14" opacity=".9" />
          <polygon points="-36,-12 -28,2 -24,-14" opacity=".9" />
          <polygon points="22,30 10,28 14,18 28,20" opacity=".9" />
          <polygon points="-22,30 -10,28 -14,18 -28,20" opacity=".9" />
        </g>
      </g>
    </svg>
  );
}
