import React from "react"
import styled from "styled-components"
import Layout from "Layouts/layout"
import SEO from "Components/seo"
import { sampleItems } from "Components/atlas/sampleData"
import type { AtlasItem } from "Components/atlas/types"

const useSlug = (): string | null => {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search)
  return p.get('slug')
}

const AtlasItemPage: React.FC = () => {
  const slug = useSlug()
  const item: AtlasItem | undefined = slug ? sampleItems.find(i => i.slug === slug) : undefined
  const title = item ? `${item.title} · ${labelForType(item.type)}` : 'Atlas Item'

  return (
    <Layout>
      <SEO title={title} />
      <Main>
        {item ? (
          <Article>
            <Header>
              <Badge>{iconFor(item.type)} {labelForType(item.type)}</Badge>
              <h1>{item.title}</h1>
              <p className="desc">{item.desc}</p>
            </Header>
            <MetaRow>
              <span className="status">• {statusLabel(item.status)}</span>
              <span className="elev">↑ {item.elevation}</span>
              <span className="date">{item.date}</span>
            </MetaRow>
            <Content>
              <p>This is a placeholder page for “{item.title}”. Layout and content blocks vary by type.</p>
              {renderTypeSpecific(item)}
            </Content>
          </Article>
        ) : (
          <Empty>Item not found.</Empty>
        )}
      </Main>
    </Layout>
  )
}

const renderTypeSpecific = (item: AtlasItem) => {
  switch (item.type) {
    case 'project':
      return <Section>Links: {item.repo_url && (<a href={item.repo_url} target="_blank" rel="noreferrer">Repo</a>)} {item.live_url && (<a href={item.live_url} target="_blank" rel="noreferrer">Live</a>)}</Section>
    case 'route':
      return <Section>Route overview and linear navigation would appear here.</Section>
    case 'waypoint':
      return <Section>Waypoint details with elevation ticks.</Section>
    case 'field_note':
      return <Section>Field note with softer background and status.</Section>
    case 'map':
      return <Section>Map meta and related layers.</Section>
    default:
      return null
  }
}

const labelForType = (t: string) => ({ project: 'Project', route: 'Route', waypoint: 'Waypoint', field_note: 'Field Note', map: 'Map' } as Record<string,string>)[t] || t
const iconFor = (t: string) => t === 'project' ? '▣' : t === 'route' ? '╱╲' : t === 'waypoint' ? '⬤' : t === 'field_note' ? '✎' : t === 'map' ? '🗺' as unknown as string : '•'
const statusLabel = (s: AtlasItem['status']) => ({ uncharted: 'Uncharted', in_progress: 'In progress', charted: 'Charted' } as const)[s]

const Main = styled.main`
  min-width: var(--min-width);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background: var(--color-background);
  padding: 16px 0 40px;
`

const Article = styled.article`
  width: 87.5%; max-width: var(--post-width); margin: 0 auto; display: grid; gap: 12px;
  background: var(--color-post-background);
`

const Header = styled.header`
  display: grid; gap: 8px;
  h1 { font-size: 28px; font-weight: 800; }
  .desc { color: var(--charcoal); }
`

const Badge = styled.span`
  font-size: 12px; font-family: var(--font-mono); color: var(--charcoal);
`

const MetaRow = styled.div`
  display: flex; gap: 12px; font-size: 12px; color: var(--charcoal);
  .elev { font-family: var(--font-mono); }
`

const Content = styled.section`
  display: grid; gap: 16px; line-height: 1.6;
`

const Section = styled.section``

const Empty = styled.div`
  width: 87.5%; max-width: var(--post-width); margin: 0 auto; color: var(--charcoal);
`

export default AtlasItemPage

