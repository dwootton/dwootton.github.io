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
  density?: "normal" | "compact"
}

const ItemCard: React.FC<Props> = ({
  item,
  onHover,
  onClick,
  visited = false,
  logoAlt,
  density = "normal",
}) => {
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
      data-density={density}
    >
      <Header>
        <Kicker>{labelForType(item.type)}</Kicker>
        <ArrowWrap>
          <Icon size={14} />
        </ArrowWrap>
      </Header>
      <Title $visited={visited}>{item.title}</Title>
      <Subtitle>{item.desc}</Subtitle>
      <MetaRow>
        <span>{since}</span>
        {visited ? <span>Visited</span> : null}
      </MetaRow>
      {logoSrc ? (
        <LogoRight>
          <img src={logoSrc} alt={logoAlt || item.alt || item.title} />
        </LogoRight>
      ) : null}
    </Card>
  )
}

const Card = styled.article`
  position: relative;
  min-width: 0;
  display: grid;
  gap: 12px;
  padding: 18px 18px 20px;
  border-radius: 6px;
  background: var(--color-card);
  border: 1px solid var(--card-border);
  box-shadow: 0 1px 2px var(--shadow), 0 8px 24px var(--shadow);
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease,
    box-shadow 0.18s ease, background-color 0.18s ease;

  &:hover,
  &:focus {
    transform: translateY(-2px);
    border-color: var(--color-floating-button-border-hover);
    box-shadow: 0 1px 2px var(--shadow), 0 12px 30px var(--shadow);
  }

  &[data-density="compact"] {
    gap: 8px;
    padding: 12px 12px 13px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(50, 42, 32, 0.06),
      0 6px 18px rgba(50, 42, 32, 0.06);

    &:hover,
    &:focus {
      transform: translateY(-1px);
      box-shadow: 0 1px 2px rgba(50, 42, 32, 0.08),
        0 8px 22px rgba(50, 42, 32, 0.09);
    }
  }
`

const Header = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const Kicker = styled.span`
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  color: var(--color-text-3);
  text-transform: uppercase;
  overflow-wrap: anywhere;

  [data-density="compact"] & {
    font-size: 0.56rem;
    letter-spacing: 0.12em;
  }
`

const ArrowWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-3);
`

const Title = styled.h3<{ $visited?: boolean }>`
  min-width: 0;
  font-size: 1.55rem;
  line-height: 1.08;
  letter-spacing: 0;
  color: ${p => (p.$visited ? "var(--green)" : "var(--color-text)")};
  overflow-wrap: break-word;

  [data-density="compact"] & {
    font-size: 1.08rem;
    line-height: 1.08;
    letter-spacing: 0;
  }
`

const Subtitle = styled.p`
  min-width: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--color-text-2);
  overflow-wrap: break-word;

  [data-density="compact"] & {
    font-size: 0.78rem;
    line-height: 1.42;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
`

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  color: var(--color-text-3);

  [data-density="compact"] & {
    font-size: 0.56rem;
  }
`

function timeSince(iso?: string) {
  if (!iso) return ""
  const then = new Date(iso).getTime()
  if (isNaN(then)) return ""
  const s = Math.floor((Date.now() - then) / 1000)
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, "y ago"],
    [60 * 60 * 24 * 30, "mo ago"],
    [60 * 60 * 24 * 7, "w ago"],
    [60 * 60 * 24, "d ago"],
  ]
  for (const [sec, label] of units) {
    const v = Math.floor(s / sec)
    if (v >= 1) return `${v}${label}`
  }
  return "new"
}

const labelForType = (t: AtlasItem["type"]) =>
  ({
    project: "Project",
    route: "Route",
    waypoint: "Waypoint",
    field_note: "Field note",
    map: "Map",
  }[t] || t)

function resolveLogo(thumbnail?: string) {
  if (!thumbnail) return undefined
  if (/^https?:\/\//.test(thumbnail)) return thumbnail
  if (thumbnail.startsWith("/")) return thumbnail
  return undefined
}

const LogoRight = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;

  [data-density="compact"] & {
    top: 10px;
    right: 10px;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    object-fit: cover;
    border: 1px solid var(--color-divider);
  }

  [data-density="compact"] & img {
    width: 24px;
    height: 24px;
  }
`

export default ItemCard
