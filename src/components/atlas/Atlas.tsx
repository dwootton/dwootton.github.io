import React from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import AtlasMap from "./AtlasMap"
import ItemCard from "./ItemCard"
import type { AtlasItem } from "./types"
import { sampleItems } from "./sampleData"

interface Props { items?: AtlasItem[] }

const Atlas: React.FC<Props> = ({ items = sampleItems }) => {
  const [selected, setSelected] = React.useState<string | null>(null)

  const selectedItem = selected ? items.find(i => i.slug === selected) || null : null
  const [hoverTip, setHoverTip] = React.useState<{ slug: string | null; cx: number; cy: number } | null>(null)
  const [overlay, setOverlay] = React.useState({ opacity: 1, scale: 1 })
  const [cardHover, setCardHover] = React.useState<string | null>(null)
  const [visited, setVisited] = React.useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const raw = localStorage.getItem('atlasVisited')
      if (!raw) return new Set()
      return new Set(JSON.parse(raw))
    } catch { return new Set() }
  })

  const recordVisit = React.useCallback((slug: string | null) => {
    if (!slug) return
    setVisited(prev => {
      const next = new Set(prev)
      next.add(slug)
      try { localStorage.setItem('atlasVisited', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }, [])

  return (
    <Main>
      <MapWrap>
        <MapCell onMouseEnter={() => setOverlay({ opacity: 0.15, scale: 0.98 })} onMouseLeave={() => setOverlay({ opacity: 1, scale: 1 })}>
          <AtlasMap
            data={items}
            onSelect={(slug) => { if (slug) { recordVisit(slug); navigate(buildItemUrl(slug)) } }}
            onHover={(info) => {
              setHoverTip(info)
              // Hover only dims overlay while hovering
              setOverlay(o => (info.slug ? { opacity: 0.15, scale: 0.98 } : o))
            }}
            hoverSlug={cardHover}
            visitedSlugs={visited}
          />
          <HeroOverlay style={{ opacity: overlay.opacity, transform: `scale(${overlay.scale})` }}>
            <h1>The Atlas</h1>
            <p>Writings, prototypes, and code projects mapped as a landscape.</p>
          </HeroOverlay>
          {hoverTip?.slug && (
            <NameTooltip
              style={{
                left: hoverTip.cx,
                top: hoverTip.cy,
              }}
              onClick={() => {
                if (!hoverTip?.slug) return
                recordVisit(hoverTip.slug)
                navigate(buildItemUrl(hoverTip.slug))
              }}
            >
              <strong>{items.find(i => i.slug === hoverTip.slug)?.title}</strong>
            </NameTooltip>
          )}
        </MapCell>
      </MapWrap>

      <List>
        {items.map(item => (
          <ItemCard
            key={item.slug}
            item={item}
            onHover={(slug) => setCardHover(slug)}
            onClick={(slug) => { recordVisit(slug); navigate(buildItemUrl(item.slug)) }}
            visited={visited.has(item.slug)}
          />
        ))}
      </List>
    </Main>
  )
}

const Main = styled.main`
  min-width: var(--min-width);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background: var(--color-background);
  padding: 16px 0 40px;
`

const MapWrap = styled.section`
  width: 87.5%; max-width: var(--width); margin: 8px auto 16px;
`

const MapCell = styled.div`
  position: relative;
`

const Tooltip = styled.div`
  position: absolute;
  z-index: 10;
  pointer-events: auto;
  max-width: 320px;
`

const HeroOverlay = styled.div`
  position: absolute;
  left: 16px;
  top: 12px;
  pointer-events: none;
  transition: opacity 600ms ease, transform 600ms ease;
  h1 { font-size: 48px; font-weight: 800; line-height: 1.05; color: var(--color-text); }
  p { font-size: 18px; color: var(--color-text-3); margin-top: 6px; max-width: 38ch; }
  @media (max-width: 600px) {
    h1 { font-size: 32px; }
    p { font-size: 16px; }
  }
`

const List = styled.section`
  width: 87.5%;
  max-width: var(--width);
  margin: 12px auto 0;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
  @media (min-width: 1100px) { grid-template-columns: 1fr 1fr 1fr; }
`

const NameTooltip = styled.button`
  position: absolute;
  z-index: 11;
  transform: translate(-50%, -100%);
  background: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-divider);
  border-radius: 6px;
  padding: 6px 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,.15);
  font-size: 12px;
  pointer-events: auto;
  cursor: pointer;
  &:hover { box-shadow: 0 6px 16px rgba(0,0,0,.22); }
`

export default Atlas

export const buildItemUrl = (slug: string) => `/atlas-item?slug=${encodeURIComponent(slug)}`

const orderItems = (items: AtlasItem[], selected: string | null) => {
  if (!selected) return items
  const idx = items.findIndex(i => i.slug === selected)
  if (idx <= 0) return items
  const arr = items.slice()
  const [it] = arr.splice(idx, 1)
  arr.unshift(it)
  return arr
}
