import React from 'react'
import styled from 'styled-components'
import TypeChip from './TypeChip'
import StatusChip from './StatusChip'
import MapKeyCard from './MapKeyCard'
import ToC from './ToC'
import FooterNav from './FooterNav'
import type { PageTypeProps } from './types'

export default function PageType({ frontmatter: fm, children, related, prev, next, mapKey }: PageTypeProps) {
  const contentRef = React.useRef<HTMLElement>(null)
  return (
    <Wrap>
      <Header>
        <TypeChip type={fm.type} />
        <Title as={fm.type === 'essay' ? 'h1' : 'h1'} $essay={fm.type === 'essay'}>{fm.title}</Title>
        {fm.deck && <Deck>{fm.deck}</Deck>}
        <Meta>
          {fm.topics && fm.topics.length > 0 && <div className="topics">{fm.topics.join(' · ')}</div>}
          {(fm.date || fm.updated) && (
            <div className="dates">
              {fm.date && <span>Planted {fm.date}</span>}
              {fm.updated && <span> · Last tended {fm.updated}</span>}
            </div>
          )}
          <div className="status">
            <StatusChip status={fm.status} />
          </div>
          {typeof fm.elevation === 'number' && (
            <div className="elev" aria-label={`Elevation ${fm.elevation} of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < (fm.elevation || 0) ? 'on' : ''} />
              ))}
            </div>
          )}
        </Meta>
      </Header>

      <Grid>
        <Rail>
          <MapKeyCard fm={fm} fields={mapKey} />
          <ToC forRef={contentRef} />
        </Rail>
        <Main ref={contentRef as any}>
          {children}
          <FooterNav tags={fm.tags} related={related} prev={prev || undefined} next={next || undefined} />
        </Main>
      </Grid>
    </Wrap>
  )
}

const Wrap = styled.div`
  width: 87.5%; max-width: var(--width); margin: 0 auto; padding: 20px 0 40px;
`

const Header = styled.header`
  display: grid; gap: 10px; margin-bottom: 14px;
`

const Title = styled.h1<{ $essay?: boolean }>`
  font-family: var(--font-serif);
  font-size: ${p => (p.$essay ? '2.2rem' : '1.8rem')};
  line-height: 1.25;
  font-weight: 800;
`

const Deck = styled.p`
  color: var(--color-text-2); font-size: 1.05rem;
`

const Meta = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  .topics { font-size: 14px; color: var(--color-text-2); }
  .dates { font-size: 12px; color: var(--color-text-3); }
  .status { }
  .elev { display: inline-flex; gap: 4px; }
  .elev span { width: 8px; height: 8px; border-radius: 2px; background: var(--color-divider); }
  .elev span.on { background: var(--accent); }
`

const Grid = styled.div`
  display: grid; gap: 24px; grid-template-columns: 1fr; align-items: start;
  @media (min-width: 1000px) { grid-template-columns: 280px 1fr; }
`

const Rail = styled.aside`
  display: grid; gap: 16px;
`

const Main = styled.main`
  display: grid; gap: 16px; line-height: 1.6; font-size: 1.05rem;
  max-width: var(--post-width);
  p { color: var(--color-text) }
  blockquote { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--color-text-2) }
  pre { background: var(--color-code-block); padding: 12px; border-radius: 8px; overflow: auto; }
  code { font-family: var(--font-mono) }
  img, figure { width: 100%; border-radius: 8px; border: 1px solid var(--color-divider); }
`

export { MapKeyCard, TypeChip, StatusChip, ToC, FooterNav }

