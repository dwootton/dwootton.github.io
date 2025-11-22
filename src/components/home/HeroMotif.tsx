import React from 'react'
import styled, { keyframes } from 'styled-components'

const ping = keyframes`
  0% { transform: scale(0.9); opacity: .9 }
  70% { transform: scale(1.25); opacity: 0 }
  100% { transform: scale(1.25); opacity: 0 }
`

export default function HeroMotif() {
  return (
    <Wrap aria-hidden>
      <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
        <g stroke="var(--atlas-grid)" strokeWidth={0.6} shapeRendering="crispEdges" opacity={0.3}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`vx-${i}`} x1={i*40} y1={0} x2={i*40} y2={360} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`hy-${i}`} x1={0} y1={i*36} x2={600} y2={i*36} />
          ))}
        </g>
        {/* tiny waypoint */}
        <circle cx={420} cy={120} r={3} fill="var(--accent)" />
      </svg>
      <Ping style={{ left: 420, top: 120 }} />
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; border: 1px solid var(--color-divider);
  background: var(--color-post-background);
`

const Ping = styled.span`
  position: absolute; width: 10px; height: 10px; left: 0; top: 0; transform: translate(-5px, -5px);
  border-radius: 999px; border: 2px solid var(--accent); opacity: .8; animation: ${ping} 2.4s ease-out infinite;
  pointer-events: none;
`

