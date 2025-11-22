import React from 'react'
import styled from 'styled-components'
import type { AtlasItem } from './types'

interface Props {
  data: AtlasItem[]
  width?: number
  height?: number
  onSelect: (slug: string | null) => void
  onHover?: (info: { slug: string | null; cx: number; cy: number }) => void
  hoverSlug?: string | null
  visitedSlugs?: Set<string>
}

const typeRadius: Record<string, number> = {
  project: 6,
  route: 6,
  waypoint: 4,
  field_note: 3,
  map: 5,
}

export default function AtlasMap({ data, onSelect, onHover, hoverSlug, visitedSlugs }: Props) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 640, h: 360 })
  const [hover, setHover] = React.useState<string | null>(null)

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = Math.max(180, Math.round((w * 9) / 16))
      setSize({ w, h })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Normalize coordinates to viewBox with padding
  const pad = 20
  const mins = React.useMemo(() => {
    const xs = data.map(d => d.x)
    const ys = data.map(d => d.y)
    return { minX: Math.min(...xs, -1), maxX: Math.max(...xs, 1), minY: Math.min(...ys, -1), maxY: Math.max(...ys, 1) }
  }, [data])
  const nx = React.useCallback((x: number) => ((x - mins.minX) / (mins.maxX - mins.minX || 1)) * (size.w - pad * 2) + pad, [size.w, mins])
  const ny = React.useCallback((y: number) => ((y - mins.minY) / (mins.maxY - mins.minY || 1)) * (size.h - pad * 2) + pad, [size.h, mins])

  const handleEnter = (d: AtlasItem) => {
    setHover(d.slug)
    onHover?.({ slug: d.slug, cx: nx(d.x), cy: ny(d.y) })
  }
  const handleLeave = () => {
    setHover(null)
    onHover?.({ slug: null, cx: 0, cy: 0 })
  }

  return (
    <Wrap ref={wrapRef}>
      <svg width="100%" height="auto" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Atlas Map scatterplot">
        {/* Grid */}
        <g stroke="var(--atlas-grid)" strokeWidth={1} shapeRendering="crispEdges">
          {Array.from({ length: Math.ceil(size.w / 40) + 1 }).map((_, i) => {
            const x = i * 40
            return <line key={`vx-${i}`} x1={x} y1={0} x2={x} y2={size.h} />
          })}
          {Array.from({ length: Math.ceil(size.h / 40) + 1 }).map((_, i) => {
            const y = i * 40
            return <line key={`hy-${i}`} x1={0} y1={y} x2={size.w} y2={y} />
          })}
        </g>
        {/* Points */}
        <g>
          {data.map(d => {
            const cx = nx(d.x)
            const cy = ny(d.y)
            const r = typeRadius[d.type] ?? 4
            const isHover = d.slug === hover || d.slug === hoverSlug
            const isVisited = visitedSlugs?.has(d.slug)
            return (
              <g key={d.slug}>
                {isHover && <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="var(--accent)" strokeWidth={2} />}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={isVisited ? 'var(--atlas-visited)' : 'var(--atlas-dot)'}
                  onMouseEnter={() => handleEnter(d)}
                  onMouseLeave={handleLeave}
                  onClick={() => onSelect(d.slug)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )
          })}
        </g>
      </svg>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  border: 1px solid var(--color-divider);
  background: var(--color-post-background);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
`

