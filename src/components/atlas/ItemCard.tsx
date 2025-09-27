import React from "react"
import styled from "styled-components"
import type { AtlasItem } from "./types"
import { iconForType } from "../atlas/icons"

interface Props {
  item: AtlasItem
  onHover?: (slug: string | null) => void
  onClick?: (slug: string) => void
  visited?: boolean
  logoAlt?: string
}

const ItemCard: React.FC<Props> = ({ item, onHover, onClick, visited = false, logoAlt }) => {
  const Icon = iconForType(item.type)
  const since = timeSince(item.date)
  const logoSrc = resolveLogo(item.thumbnail)
  return (
    <Card
      onMouseEnter={() => onHover?.(item.slug)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(item.slug)}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} ${item.type}`}
    >
      <TitleRow>
        <Title $visited={visited}>{item.title}</Title>
        <InlineIcon><Icon size={16} /></InlineIcon>
      </TitleRow>
      {logoSrc ? (
        <LogoRight>
          <img src={logoSrc} alt={logoAlt || item.alt || item.title} />
        </LogoRight>
      ) : null}
      <Subtitle>{item.desc}</Subtitle>
      <MetaRow>
        <span className="type">{labelForType(item.type)}</span>
        <span className="dot">·</span>
        <span className="time">{since}</span>
        {visited && <span className="dot">·</span>}
        {visited && <span className="visited">Visited</span>}
      </MetaRow>
    </Card>
  )
}

const statusLabel = (s: AtlasItem["status"]) =>
  ({ uncharted: "Uncharted", in_progress: "In progress", charted: "Charted" } as const)[s]

const Card = styled.article`
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-card);
  border: 1px solid var(--color-divider);
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
  cursor: pointer;
  transition: box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
  max-width: 360px;
  &:hover, &:focus {
    border-color: transparent;
    background: var(--card-hover-bg);
    box-shadow: var(--card-hover-shadow);
  }
`

const TitleRow = styled.div`
  display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;
`

const InlineIcon = styled.span`
  display: inline-flex; align-items: center; color: var(--color-text-2);
`

const Title = styled.h3<{ $visited?: boolean }>`
  font-size: 18px;
  line-height: 1.35;
  font-weight: 800;
  font-family: var(--font-sans);
  color: ${p => (p.$visited ? 'var(--atlas-visited)' : 'var(--color-text)')};
`

const Subtitle = styled.p`
  font-size: 14px;
  line-height: 1.15;
  color: var(--color-text-3);
`

const MetaRow = styled.div`
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--color-text-3);
  .dot { opacity: .6 }
  .visited { color: var(--atlas-visited); }
`

function timeSince(iso?: string) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  const units: [number, string][] = [
    [60*60*24*365, 'y'],
    [60*60*24*30, 'mo'],
    [60*60*24*7, 'w'],
    [60*60*24, 'd'],
    [60*60, 'h'],
    [60, 'm'],
  ]
  for (const [sec, label] of units) {
    const v = Math.floor(s / sec)
    if (v >= 1) return `${v}${label} ago`
  }
  return 'just now'
}

const labelForType = (t: AtlasItem['type']) => ({
  project: 'Project',
  route: 'Route',
  waypoint: 'Waypoint',
  field_note: 'Note',
  map: 'Map',
}[t] || t)

function resolveLogo(thumbnail?: string) {
  if (!thumbnail) return undefined
  if (/^https?:\/\//.test(thumbnail)) return thumbnail
  if (thumbnail.startsWith('/')) return thumbnail
  // Support common public paths (user can place logos in /static or /public)
  // If provided a relative path (e.g., src/posts/... or ./images/...), we cannot reliably require it here.
  // Encourage absolute site path; otherwise skip.
  return undefined
}

const LogoRight = styled.div`
  position: absolute; right: 12px; top: 12px;
  img { width: 32px; height: 32px; border-radius: 6px; object-fit: cover; border: 1px solid var(--color-divider); }
`

export default ItemCard
