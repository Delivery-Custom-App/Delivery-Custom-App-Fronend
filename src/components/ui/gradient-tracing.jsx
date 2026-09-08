export function GradientTracing({
  width,
  height,
  baseColor = 'black',
  gradientColors = ['#2EB9DF', '#2EB9DF', '#9E00FF'],
  animationDuration = 2,
  strokeWidth = 2,
  path = `M0,${height / 2} L${width},${height / 2}`,
}) {
  const gradientId = `pulse-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <path d={path} style={{ stroke: baseColor }} strokeOpacity="0.2" strokeWidth={strokeWidth} />
        <path d={path} stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth={strokeWidth} />
        <defs>
          {/* Animación SVG nativa (SMIL) en vez de framer-motion: motion.linearGradient
              no soporta x1/x2 como propiedades SVG reconocidas y termina pasando
              "undefined" al DOM, generando errores de consola en cada frame. */}
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
            <stop style={{ stopColor: gradientColors[0] }} stopOpacity="0" />
            <stop style={{ stopColor: gradientColors[1] }} />
            <stop offset="1" style={{ stopColor: gradientColors[2] }} stopOpacity="0" />
            <animate
              attributeName="x1"
              values={`0;${width * 2}`}
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values={`0;${width}`}
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
