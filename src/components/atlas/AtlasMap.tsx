import React from "react"
import styled from "styled-components"

import type { AtlasItem } from "./types"

interface Props {
  data: AtlasItem[]
  width?: number
  height?: number
  onSelect: (slug: string | null) => void
  onHover?: (info: { slug: string | null; cx: number; cy: number }) => void
  hoverSlug?: string | null
  visitedSlugs?: Set<string>
  variant?: "framed" | "background"
  onMapClick?: () => void
}

const typeRadius: Record<string, number> = {
  project: 5,
  route: 5,
  waypoint: 3.6,
  field_note: 3.1,
  map: 4.5,
}

export default function AtlasMap({
  data,
  onSelect,
  onHover,
  hoverSlug,
  visitedSlugs,
  variant = "framed",
  onMapClick,
}: Props) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const [size, setSize] = React.useState<{ w: number; h: number }>({
    w: 640,
    h: 360,
  })
  const [hover, setHover] = React.useState<string | null>(null)

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const w = Math.max(320, Math.round(rect.width || el.clientWidth || 640))
      const h = Math.max(220, Math.round(rect.height || (w * 9) / 16))
      setSize({ w, h })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pad = 26
  const plottedItems = React.useMemo(() => {
    return data.map((item, index) => {
      const angle = index * 1.78
      const radius = 0.28 + (index % 4) * 0.18
      return {
        ...item,
        x: Number.isFinite(item.x) ? item.x : Math.cos(angle) * radius,
        y: Number.isFinite(item.y) ? item.y : Math.sin(angle) * radius,
      }
    })
  }, [data])

  const mins = React.useMemo(() => {
    const xs = plottedItems.map(d => d.x)
    const ys = plottedItems.map(d => d.y)
    return {
      minX: Math.min(...xs, -1),
      maxX: Math.max(...xs, 1),
      minY: Math.min(...ys, -1),
      maxY: Math.max(...ys, 1),
    }
  }, [plottedItems])

  const nx = React.useCallback(
    (x: number) =>
      ((x - mins.minX) / (mins.maxX - mins.minX || 1)) * (size.w - pad * 2) +
      pad,
    [size.w, mins]
  )
  const ny = React.useCallback(
    (y: number) =>
      ((y - mins.minY) / (mins.maxY - mins.minY || 1)) * (size.h - pad * 2) +
      pad,
    [size.h, mins]
  )

  const handleEnter = (d: AtlasItem) => {
    setHover(d.slug)
    onHover?.({ slug: d.slug, cx: nx(d.x), cy: ny(d.y) })
  }

  const handleLeave = () => {
    setHover(null)
    onHover?.({ slug: null, cx: 0, cy: 0 })
  }

  return (
    <Wrap ref={wrapRef} data-variant={variant} onClick={onMapClick}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Atlas map"
      >
        <g
          stroke="var(--atlas-grid)"
          strokeWidth={1}
          shapeRendering="crispEdges"
        >
          {Array.from({ length: Math.ceil(size.w / 48) + 1 }).map((_, i) => {
            const x = i * 48
            return <line key={`vx-${i}`} x1={x} y1={0} x2={x} y2={size.h} />
          })}
          {Array.from({ length: Math.ceil(size.h / 48) + 1 }).map((_, i) => {
            const y = i * 48
            return <line key={`hy-${i}`} x1={0} y1={y} x2={size.w} y2={y} />
          })}
        </g>
        <g>
          {plottedItems.map(d => {
            const cx = nx(d.x)
            const cy = ny(d.y)
            const r = typeRadius[d.type] ?? 4
            const isHover = d.slug === hover || d.slug === hoverSlug
            const isVisited = visitedSlugs?.has(d.slug)
            return (
              <g key={d.slug}>
                {isHover ? (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 4}
                    fill="none"
                    stroke="rgba(155, 104, 71, 0.52)"
                    strokeWidth={1.4}
                  />
                ) : null}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={isVisited ? "var(--atlas-visited)" : "var(--atlas-dot)"}
                  onMouseEnter={() => handleEnter(d)}
                  onMouseLeave={handleLeave}
                  onClick={event => {
                    event.stopPropagation()
                    onSelect(d.slug)
                  }}
                  style={{ cursor: "pointer" }}
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
  min-width: 0;
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--card-border);
  background: var(--color-card);
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  min-height: 220px;
  box-shadow: 0 1px 2px var(--shadow), 0 8px 24px var(--shadow);

  svg {
    display: block;
  }

  &[data-variant="background"] {
    border-color: rgba(96, 78, 52, 0.12);
    background: var(--surface);
    box-shadow: 0 1px 2px rgba(50, 42, 32, 0.04),
      0 18px 48px rgba(50, 42, 32, 0.09);
  }
`
