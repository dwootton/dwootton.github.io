import React from 'react'
import styled from 'styled-components'
import type { AtlasItem } from 'Components/atlas/types'
import { navigate } from 'gatsby'
import { buildItemUrl } from 'Components/atlas/Atlas'

interface Props {
  items: AtlasItem[]
  focus?: number // 0..1 vertical focus position (0=top, 1=bottom)
}

// Normalize [-1,1] → [pad, W-pad] etc.
function projector(width: number, height: number, pad = 24) {
  const W = Math.max(1, width), H = Math.max(1, height)
  const nx = (x: number) => ((x + 1) / 2) * (W - pad * 2) + pad
  const ny = (y: number) => ((y + 1) / 2) * (H - pad * 2) + pad
  return { nx, ny, W, H }
}

const HomeBackgroundSVG: React.FC<Props> = ({ items, focus = 0.7 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 1000, h: 560 })

  React.useEffect(() => {
    const update = () => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      setSize({ w: Math.max(320, r.width), h: Math.max(200, r.height) })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { nx, ny, W, H } = projector(size.w, size.h)
  const yOffset = (focus - 0.5) * H * 0.4 // gentle vertical nudge toward focus region

  // Grid spacing ~ 40px
  const gx: number[] = []
  for (let x = 0; x <= W; x += 40) gx.push(x)
  const gy: number[] = []
  for (let y = 0; y <= H; y += 40) gy.push(y)

  return (
    <Wrap ref={ref} aria-hidden>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <g opacity={0.8}>
          {/* grid */}
          <g stroke="var(--atlas-grid)" strokeWidth={0.5} shapeRendering="crispEdges">
            {gx.map((x, i) => (
              <line key={`vx-${i}`} x1={x} y1={0} x2={x} y2={H} />
            ))}
            {gy.map((y, i) => (
              <line key={`hy-${i}`} x1={0} y1={y} x2={W} y2={y} />
            ))}
          </g>
          {/* points */}
          <g transform={`translate(0, ${yOffset.toFixed(2)})`}>
            {items.map(d => (
              <circle
                key={d.slug}
                cx={nx(d.x)}
                cy={ny(d.y)}
                r={dotRadius(d.type)}
                fill="var(--atlas-dot)"
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('atlasVisited')
                    const set = new Set<string>(raw ? JSON.parse(raw) : [])
                    set.add(d.slug)
                    localStorage.setItem('atlasVisited', JSON.stringify(Array.from(set)))
                  } catch (_) {
                    return undefined
                  }
                  navigate(buildItemUrl(d.slug))
                }}
              />
            ))}
          </g>
        </g>
      </svg>
    </Wrap>
  )
}

function dotRadius(type: AtlasItem['type']) {
  switch (type) {
    case 'project':
    case 'route':
      return 4.5
    case 'waypoint':
      return 3.5
    case 'field_note':
    default:
      return 3
  }
}

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: auto;
  z-index: 0;
  opacity: 0.55;
`

export default HomeBackgroundSVG
