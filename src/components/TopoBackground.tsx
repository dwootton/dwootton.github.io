import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { contours as d3contours } from 'd3-contour'
import { geoIdentity, geoPath } from 'd3-geo'

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 900
const HORIZ_MARGIN = 200

const TopoBackground: React.FC = () => {
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const update = () => {
      const doc = document.documentElement
      const body = document.body
      const width = Math.max(window.innerWidth, doc?.scrollWidth ?? DEFAULT_WIDTH, body?.scrollWidth ?? DEFAULT_WIDTH)
      const height = Math.max(
        window.innerHeight,
        doc?.scrollHeight ?? DEFAULT_HEIGHT,
        doc?.offsetHeight ?? DEFAULT_HEIGHT,
        body?.scrollHeight ?? DEFAULT_HEIGHT,
        body?.offsetHeight ?? DEFAULT_HEIGHT
      )
      setSize(prev => {
        if (Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1) {
          return prev
        }
        return { width, height }
      })
    }

    update()
    window.addEventListener('resize', update)

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => update())
      observer.observe(document.documentElement)
      observer.observe(document.body)
    }

    return () => {
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [])

  // Compute all contour data and paths in a memoized block
  const { contourPaths } = useMemo(() => {
    const { width, height } = size
    const safeWidth = Math.max(width + HORIZ_MARGIN * 2, 1)
    const safeHeight = Math.max(height, 1)

    const gridCols = 220
    const gridRows = Math.max(120, Math.round(gridCols * (safeHeight / safeWidth)))
    const values = new Array(gridCols * gridRows)
    let minVal = Number.POSITIVE_INFINITY
    let maxVal = Number.NEGATIVE_INFINITY

    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        const nx = x / gridCols
        const ny = y / gridRows

        // Create mountainous terrain with multiple octaves
        let elevation = 0
        elevation += Math.sin(nx * 4 * Math.PI) * Math.cos(ny * 4 * Math.PI) * 30
        elevation += Math.sin(nx * 8 * Math.PI) * Math.cos(ny * 6 * Math.PI) * 15
        elevation += Math.sin(nx * 16 * Math.PI) * Math.cos(ny * 12 * Math.PI) * 8

        // Add some peaks with offsets that avoid symmetric repeating seams
        const dist1 = Math.sqrt(Math.pow(nx - 0.25, 2) + Math.pow(ny - 0.37, 2))
        const dist2 = Math.sqrt(Math.pow(nx - 0.68, 2) + Math.pow(ny - 0.62, 2))
        elevation += Math.exp(-dist1 * 20) * 40
        elevation += Math.exp(-dist2 * 15) * 35

        const val = elevation + 50
        const idx = y * gridCols + x
        values[idx] = val
        if (val < minVal) minVal = val
        if (val > maxVal) maxVal = val
      }
    }

    if (!Number.isFinite(minVal) || !Number.isFinite(maxVal) || minVal === maxVal) {
      minVal = 0
      maxVal = 1
    }

    // Create contours
    const contourGen = d3contours()
      .size([gridCols, gridRows])
      .thresholds(
        Array.from(
          { length: 32 },
          (_, i) => minVal + ((maxVal - minVal) / 32) * i
        )
      )

    const contourData = contourGen(values)

    // Scale for positioning
    const scale = Math.min((safeWidth) / gridCols, safeHeight / gridRows)
    const translateX = (safeWidth - gridCols * scale) / 2 - HORIZ_MARGIN
    const translateY = (safeHeight - gridRows * scale) / 2
    const projection = geoIdentity().scale(scale).translate([translateX, translateY])
    const pathGen = geoPath(projection)

    // Precompute SVG paths for each contour
    const contourPaths = contourData.map((d, i) => ({
      d: pathGen(d) || '',
      key: `contour-${i}`,
      strokeWidth: i % 6 === 0 ? 2 : i % 3 === 0 ? 1.3 : 0.7,
      opacity: i % 6 === 0 ? 0.9 : i % 3 === 0 ? 0.55 : 0.35,
    }))

    return { contourPaths }
  }, [size.height, size.width])

  return (
    <Wrap aria-hidden="true" $height={size.height}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.width } ${size.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="topo-fade-left" x1="50%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="55%" stopColor="white" stopOpacity="0.0" />
            <stop offset="95%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="topo-fade-right" x1="50%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="55%" stopColor="white" stopOpacity="0.0" />
            <stop offset="95%" stopColor="white" stopOpacity="0.20" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
          <mask id="topo-mask">
            <rect width="100%" height="100%" fill="url(#topo-fade)" />
            <rect width="100%" height="100%" fill="url(#topo-fade-left)" />
            <rect width="100%" height="100%" fill="url(#topo-fade-right)" />
          </mask>
        </defs>
        <rect
          x={-HORIZ_MARGIN}
          y={0}
          width={size.width + HORIZ_MARGIN * 2}
          height={size.height}
          fill="var(--color-background)"
        />
        <g id="topo-contours" mask="url(#topo-mask)">
          {contourPaths.map(({ d, key, strokeWidth, opacity }) => (
            <path
              key={key}
              d={d}
              fill="none"
              stroke="var(--color-text-2)"
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
          ))}
        </g>
        {/* Optionally, add elevation labels on major contours (hidden for background) */}
        {/* 
        <g>
          {contourPaths
            .filter((_, i) => i % 5 === 0)
            .map(({ d, key }, idx) => {
              // Not rendering labels for background
              return null
            })}
        </g>
        */}
      </svg>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  width: 100%;
  height: ${props => (props as any).$height}px;
  min-height: 100%;
  svg {
    width: 100%;
    height: 100%;
    display: block;
    background: none;
  }
  #topo-contours {
    opacity: 0;
    animation: linesCover 900ms ease-out forwards;
  }
  @media (max-width: 768px) {
    display: none;
  }

  @keyframes linesCover {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export default TopoBackground
