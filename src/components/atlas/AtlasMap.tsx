import React from "react"
import styled from "styled-components"
import type { AtlasItem } from "./types"
import useTheme from "Hooks/useTheme"

interface Props {
  data: AtlasItem[]
  width?: number
  height?: number
  onSelect: (slug: string | null) => void
  onHover?: (info: { slug: string | null; cx: number; cy: number }) => void
  hoverSlug?: string | null
}

const typeSize: Record<string, number> = {
  project: 6,
  route: 6,
  waypoint: 4,
  field_note: 3,
  map: 5,
}

const AtlasMap: React.FC<Props> = ({ data, width = 800, height = 450, onSelect, onHover, hoverSlug }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const [hover, setHover] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<string | null>(null)
  // No pan/zoom per requirements
  const { theme } = useTheme()
  const [themeTick, setThemeTick] = React.useState(0)

  // Fallback: observe body.class changes to ensure redraw on theme flips
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const target = document.body
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          setThemeTick(t => t + 1)
          break
        }
      }
    })
    obs.observe(target, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const filtered = data

  const scale = React.useMemo(() => {
    const xs = filtered.map(d => d.x)
    const ys = filtered.map(d => d.y)
    const minX = Math.min(...xs, -1), maxX = Math.max(...xs, 1)
    const minY = Math.min(...ys, -1), maxY = Math.max(...ys, 1)
    const pad = 20
    const nx = (x: number) => ((x - minX) / (maxX - minX || 1)) * (width - pad * 2) + pad
    const ny = (y: number) => ((y - minY) / (maxY - minY || 1)) * (height - pad * 2) + pad
    return { nx, ny }
  }, [filtered, width, height])

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const w = width * dpr
    const h = height * dpr
    ctx.canvas.width = w
    ctx.canvas.height = h
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)
    ctx.save()

    // Resolve atlas colors from CSS variables once per draw
    let grid = '#666'
    let dot = '#2A2A2A'
    let highlight = '#FFCC00'
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.body)
      grid = (styles.getPropertyValue('--atlas-grid') || styles.getPropertyValue('--color-divider')).trim() || grid
      dot = (styles.getPropertyValue('--atlas-dot')).trim() || dot
      highlight = (styles.getPropertyValue('--accent')).trim() || highlight
    }
    ctx.strokeStyle = grid
    ctx.lineWidth = 1
    for (let gx = 0; gx < width; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke()
    }
    for (let gy = 0; gy < height; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke()
    }

    // Points
    filtered.forEach(d => {
      const x = scale.nx(d.x)
      const y = scale.ny(d.y)
      const r = typeSize[d.type] ?? 4
      ctx.beginPath()
      ctx.fillStyle = dot
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      // Hover/selected halo
      if (d.slug === hover || d.slug === selected || d.slug === hoverSlug) {
        ctx.lineWidth = 2
        ctx.strokeStyle = highlight
        ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke()
      }
    })

    ctx.restore()
  }, [filtered, scale, width, height, hover, hoverSlug, selected, theme, themeTick])

  // Hit test
  const pick = (pxCSS: number, pyCSS: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    const sx = rect ? rect.width / width : 1
    const sy = rect ? rect.height / height : 1
    const x0 = pxCSS / sx
    const y0 = pyCSS / sy
    for (let i = filtered.length - 1; i >= 0; i--) {
      const d = filtered[i]
      const x = scale.nx(d.x)
      const y = scale.ny(d.y)
      const r = (typeSize[d.type] ?? 4) + 4
      const dx = x - x0
      const dy = y - y0
      if (dx * dx + dy * dy <= r * r) return d.slug
    }
    return null
  }

  const onMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top
    const slug = pick(localX, localY)
    setHover(slug)
    if (onHover) {
      if (slug) {
        const d = filtered.find(d => d.slug === slug)
        if (d) {
          const sx = rect.width / width
          const sy = rect.height / height
          const x = scale.nx(d.x) * sx
          const y = scale.ny(d.y) * sy
          onHover({ slug, cx: x, cy: y })
        } else {
          onHover({ slug: null, cx: localX, cy: localY })
        }
      } else {
        onHover({ slug: null, cx: localX, cy: localY })
      }
    }
  }

  const onClick: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const slug = pick(e.clientX - rect.left, e.clientY - rect.top)
    setSelected(slug)
    onSelect(slug)
  }

  // Wheel zoom
  // No wheel zoom or drag pan

  // Keyboard navigation (← → within same cluster)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selected) return
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      const cur = data.find(d => d.slug === selected)
      if (!cur) return
      const inCluster = data.filter(d => d.cluster === cur.cluster)
      const idx = inCluster.findIndex(d => d.slug === selected)
      const nextIdx = (idx + (e.key === "ArrowRight" ? 1 : -1) + inCluster.length) % inCluster.length
      const next = inCluster[nextIdx]
      setSelected(next.slug)
      onSelect(next.slug)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selected, data, onSelect])

  return (
    <Wrap>
      <Canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={onMouseMove}
        onClick={onClick}
        role="img"
        aria-label="Atlas Map scatterplot"
      />
    </Wrap>
  )
}

// Point color resolved via CSS variables inside draw effect

const Wrap = styled.div`
  position: relative;
  border: 1px solid var(--color-divider);
  background: var(--color-post-background);
  border-radius: 8px;
  overflow: hidden;
`

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  touch-action: auto;
`

// bottom-left live tooltip removed per design

export default AtlasMap
