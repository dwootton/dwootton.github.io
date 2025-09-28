import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Link } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'

export interface HomeCardProps {
  title: string
  desc?: string
  slug: string
  date?: string
  type: 'Essay' | 'Field Note' | 'Project' | 'Guidepost' | 'Prototype'
  status?: 'uncharted' | 'in_progress' | 'charted'
  elevation?: number
  image?: IGatsbyImageData | null
}

export default function HomeCard({ title, desc, slug, date, type, status, elevation, image }: HomeCardProps) {
  return (
    <CardLink to={slug} aria-label={`Open ${title} (${type})`}>
      <Card>
        {image && (
          <Thumb as={GatsbyImage as any} image={image} alt=""/>
        )}
        <Title>{title}</Title>
        {desc && <Deck>{desc}</Deck>}
        <Meta>
          <TypeChip>{type}</TypeChip>
          {date && <span>· {timeSince(date)}</span>}
          {status && <StatusChip data-status={status}>{statusLabel(status)}</StatusChip>}
          {typeof elevation === 'number' && (
            <Elev aria-label={`Elevation ${elevation} of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < (elevation || 0) ? 'on' : ''} />
              ))}
            </Elev>
          )}
        </Meta>
      </Card>
    </CardLink>
  )
}

const CardLink = styled(Link)`
  text-decoration: none;
  &:focus-visible { outline: none; }
`

const Card = styled.article`
  background: var(--color-card);
  border: 1px solid #EEE;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
  padding: 16px;
  display: grid; gap: 8px;
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;
  &:hover { box-shadow: 0 8px 20px rgba(0,0,0,.12); border-color: var(--color-divider); transform: translateY(-1px); }
  @media (min-width: 900px) { padding: 20px; }
`

const Thumb = styled(GatsbyImage as any)`
  width: 100%; aspect-ratio: 3 / 2; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-divider);
  img { object-fit: cover; }
`

const Title = styled.h3`
  font-size: 18px; line-height: 1.3; font-weight: 800;
`

const Deck = styled.p`
  color: var(--color-text-2); opacity: .8; font-size: 14px;
`

const Meta = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  font-family: var(--font-mono); font-size: 12px; color: var(--color-text-3);
`

const TypeChip = styled.span`
  border: 1px solid var(--color-divider); border-radius: 999px; padding: 2px 8px;
  font-family: var(--font-mono); font-size: 11px; color: var(--color-text-3);
`

const StatusChip = styled.span`
  border: 1px solid var(--color-divider); border-radius: 999px; padding: 2px 8px; text-transform: capitalize;
`

const Elev = styled.span`
  display: inline-flex; gap: 3px; margin-left: auto;
  span{ width: 8px; height: 8px; border-radius: 2px; background: var(--color-divider) }
  span.on{ background: var(--accent) }
`

function timeSince(iso?: string) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  const units: [number, string][] = [
    [60*60*24*365, 'y'], [60*60*24*30, 'mo'], [60*60*24*7, 'w'], [60*60*24, 'd'], [60*60, 'h'], [60, 'm']
  ]
  for (const [sec, label] of units) { const v = Math.floor(s / sec); if (v >= 1) return `${v}${label} ago` }
  return 'just now'
}

function statusLabel(s: 'uncharted' | 'in_progress' | 'charted') {
  return s === 'in_progress' ? 'In Progress' : s[0].toUpperCase() + s.slice(1)
}
