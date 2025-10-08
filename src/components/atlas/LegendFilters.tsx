import React from "react"
import styled from "styled-components"
import type { AtlasItem } from "./types"

export interface Filters {
  types: Set<string>
  statuses: Set<string>
  topics: Set<string>
}

interface Props {
  data: AtlasItem[]
  filters: Filters
  onChange: (next: Filters) => void
}

const typeOrder: Record<string, number> = {
  project: 0,
  route: 1,
  waypoint: 2,
  field_note: 3,
  map: 4,
}

const LegendFilters: React.FC<Props> = ({ data, filters, onChange }) => {
  const topics = React.useMemo(() => {
    const s = new Set<string>()
    data.forEach(d => d.topics?.forEach(t => s.add(t)))
    return Array.from(s).sort()
  }, [data])

  const types = React.useMemo(() => {
    const s = new Set<string>()
    data.forEach(d => s.add(d.type))
    return Array.from(s).sort((a, b) => (typeOrder[a] ?? 99) - (typeOrder[b] ?? 99))
  }, [data])

  const statuses = React.useMemo(() => {
    const s = new Set<string>()
    data.forEach(d => s.add(d.status))
    return Array.from(s).sort()
  }, [data])

  const toggle = (group: keyof Filters, value: string) => {
    const next = new Set(filters[group] as unknown as Set<string>)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange({ ...filters, [group]: next } as Filters)
  }

  return (
    <Wrap aria-label="Legend and Filters">
      <Section>
        <Label>Type</Label>
        <Pills>
          {types.map(t => (
            <Pill
              key={t}
              role="checkbox"
              aria-checked={filters.types.has(t)}
              onClick={() => toggle("types", t)}
              $active={filters.types.has(t)}
            >
              {iconFor(t)} {labelForType(t)}
            </Pill>
          ))}
        </Pills>
      </Section>
      <Section>
        <Label>Status</Label>
        <Pills>
          {statuses.map(s => (
            <Pill
              key={s}
              role="checkbox"
              aria-checked={filters.statuses.has(s)}
              onClick={() => toggle("statuses", s)}
              $active={filters.statuses.has(s)}
            >
              {statusDot()} {labelForStatus(s)}
            </Pill>
          ))}
        </Pills>
      </Section>
      <Section>
        <Label>Topics</Label>
        <TopicsList>
          {topics.map(t => (
            <TopicChip
              key={t}
              onClick={() => toggle("topics", t)}
              $active={filters.topics.has(t)}
              role="checkbox"
              aria-checked={filters.topics.has(t)}
            >
              #{t}
            </TopicChip>
          ))}
        </TopicsList>
      </Section>
      {/* Elevation filter removed */}
    </Wrap>
  )
}

const labelForType = (t: string) =>
  ({ project: "Project", route: "Route", waypoint: "Waypoint", field_note: "Field Note", map: "Map" } as Record<string, string>)[t] || t

const labelForStatus = (s: string) =>
  ({ uncharted: "Uncharted", in_progress: "In progress", charted: "Charted" } as Record<string, string>)[s] || s

const iconFor = (t: string) => {
  switch (t) {
    case "project":
      return "▣"
    case "route":
      return "╱╲"
    case "waypoint":
      return "⬤"
    case "field_note":
      return "✎"
    case "map":
      return "🗺" as unknown as string
    default:
      return "•"
  }
}

const statusDot = () => "•"

const Wrap = styled.section`
  display: grid;
  gap: 8px;
  background: var(--mist);
  border: 1px solid var(--contour);
  border-radius: 8px;
  padding: 8px;
`

const Section = styled.div`
  display: grid;
  gap: 6px;
`

const Label = styled.div`
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--charcoal);
  letter-spacing: 0.02em;
`

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Pill = styled.button<{ $active?: boolean }>`
  border: 1px solid var(--contour);
  background: ${(p) => (p.$active ? "#fff2ea" : "var(--paper)")};
  color: var(--charcoal);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  &:focus { outline-color: var(--accent); }
`

const TopicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow: auto;
`

const TopicChip = styled.button<{ $active?: boolean }>`
  border: 1px solid var(--contour);
  background: ${(p) => (p.$active ? "#eef8f3" : "var(--paper)")};
  color: var(--charcoal);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  &:focus { outline-color: var(--accent); }
`

export default LegendFilters
