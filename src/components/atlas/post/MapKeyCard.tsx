import React from 'react'
import styled from 'styled-components'
import type { MapKeyFields, Frontmatter } from './types'

interface Props {
  fm: Frontmatter
  fields?: MapKeyFields
}

const MapKeyCard: React.FC<Props> = ({ fm, fields }) => {
  return (
    <Aside aria-label="Map Key">
      <Section>
        <Label>Type</Label>
        <Val>{fm.type}</Val>
      </Section>
      {fm.status && (
        <Section>
          <Label>Status</Label>
          <Val>{fm.status}</Val>
        </Section>
      )}
      {typeof fm.elevation === 'number' && (
        <Section>
          <Label>Elevation</Label>
          <Ticks aria-label={`Elevation ${fm.elevation} of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < (fm.elevation || 0) ? 'on' : ''} />
            ))}
          </Ticks>
        </Section>
      )}
      {fields?.audience && (
        <Section>
          <Label>Audience</Label>
          <Val>{fields.audience}</Val>
        </Section>
      )}
      {fields?.readTime && (
        <Section>
          <Label>Read time</Label>
          <Val>{fields.readTime}</Val>
        </Section>
      )}
      {fields?.effort && (
        <Section>
          <Label>Effort</Label>
          <Val>{fields.effort}</Val>
        </Section>
      )}
      {(fm.repo_url || fm.live_url || fields?.links?.length) && (
        <Section>
          <Label>Links</Label>
          <Links>
            {fm.repo_url && <a href={fm.repo_url} target="_blank" rel="noreferrer">Repo</a>}
            {fm.live_url && <a href={fm.live_url} target="_blank" rel="noreferrer">Live</a>}
            {fields?.links?.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </Links>
        </Section>
      )}
      {fields?.coordinates && (
        <Section>
          <Label>Coordinates</Label>
          <Code>{fields.coordinates}</Code>
        </Section>
      )}
      {fields?.extra?.map((e, i) => (
        <Section key={i}>
          <Label>{e.label}</Label>
          <Val>{e.value}</Val>
        </Section>
      ))}
    </Aside>
  )
}

const Aside = styled.aside`
  position: sticky; top: calc(var(--nav-height) + 16px);
  display: grid; gap: 10px;
  padding: 12px; border: 1px solid var(--color-divider); border-radius: 8px; background: var(--color-post-background);
`

const Section = styled.div`
  display: grid; gap: 4px;
`
const Label = styled.div`
  font-family: var(--font-mono); font-size: 11px; color: var(--color-text-3);
`
const Val = styled.div`
  font-size: 14px; color: var(--color-text);
`
const Code = styled.code`
  font-family: var(--font-mono); font-size: 12px; color: var(--color-text-2);
`
const Links = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
  a { color: var(--accent); text-decoration: underline; font-size: 13px }
`
const Ticks = styled.div`
  display: inline-flex; gap: 4px;
  span { width: 8px; height: 8px; border-radius: 2px; background: var(--color-divider); }
  span.on { background: var(--accent); }
`

export default MapKeyCard

