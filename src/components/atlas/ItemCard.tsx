import React from "react"
import styled from "styled-components"
import type { AtlasItem } from "./types"

interface Props {
  item: AtlasItem
  onHover?: (slug: string | null) => void
  onClick?: (slug: string) => void
}

const ItemCard: React.FC<Props> = ({ item, onHover, onClick }) => {
  return (
    <Card
      onMouseEnter={() => onHover?.(item.slug)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(item.slug)}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} ${item.type}`}
    >
      <Header>
        <Badge>{badgeFor(item.type)}</Badge>
        <Title>{item.title}</Title>
      </Header>
      <Desc>{item.desc}</Desc>
      <Meta>
        <Status><Dot aria-hidden>•</Dot>{statusLabel(item.status)}</Status>
        <Elev>↑ {item.elevation}</Elev>
      </Meta>
      <Tags>
        {item.topics.slice(0, 3).map(t => (
          <Tag key={t}>#{t}</Tag>
        ))}
      </Tags>
      {item.repo_url || item.live_url ? (
        <Links>
          {item.repo_url && (
            <a href={item.repo_url} target="_blank" rel="noreferrer">Repo</a>
          )}
          {item.live_url && (
            <a href={item.live_url} target="_blank" rel="noreferrer">Live</a>
          )}
        </Links>
      ) : null}
    </Card>
  )
}

const statusLabel = (s: AtlasItem["status"]) =>
  ({ uncharted: "Uncharted", in_progress: "In progress", charted: "Charted" } as const)[s]

const badgeFor = (t: AtlasItem["type"]) => {
  switch (t) {
    case "project":
      return "▣ Project"
    case "route":
      return "╱╲ Route"
    case "waypoint":
      return "⬤ Waypoint"
    case "field_note":
      return "✎ Field Note"
    case "map":
      return "🗺 Map"
  }
}

const Card = styled.article`
  display: grid;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: var(--color-card);
  border: 1px solid var(--color-divider);
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
  cursor: pointer;
  transition: box-shadow 120ms ease, border-color 120ms ease, transform 120ms ease;
  &:hover, &:focus {
    border-color: var(--color-nav-border);
    box-shadow: 0 8px 20px rgba(0,0,0,.18);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Badge = styled.span`
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--charcoal);
  background: var(--mist);
  border: 1px solid var(--contour);
  border-radius: 999px;
  padding: 2px 8px;
`

const Title = styled.h3`
  font-size: 16px;
  line-height: 1.3;
  font-weight: 700;
`

const Desc = styled.p`
  font-size: 14px;
  color: var(--charcoal);
`

const Meta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--charcoal);
`

const Status = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
`

const Dot = styled.span`
  font-size: 14px; line-height: 1; opacity: 0.7;
`

const Elev = styled.span`
  font-family: var(--font-mono);
`

const Tags = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px;
`

const Tag = styled.span`
  font-size: 12px; color: var(--navy);
  background: #eef3fb; border: 1px solid var(--contour); border-radius: 999px; padding: 2px 6px;
`

const Links = styled.div`
  display: flex; gap: 12px; font-size: 12px;
  a { color: var(--accent); text-decoration: underline; }
`

export default ItemCard
