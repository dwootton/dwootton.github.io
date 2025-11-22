import React from 'react'
import styled from 'styled-components'
import TypeChip from './TypeChip'
import StatusChip from './StatusChip'
// TOC temporarily removed for single-column layout
import HeadingIndicator from './HeadingIndicator'
import FooterNav from './FooterNav'
import DesktopTOC from './DesktopTOC'
import StickyRail from './StickyRail'
import type { PageTypeProps } from './types'

export default function PageType({ frontmatter: fm, children, related, prev, next, mapKey }: PageTypeProps) {
  const contentRef = React.useRef<HTMLElement>(null)
  const [tocItems, setTocItems] = React.useState<{ id: string; label: string; level?: 2 | 3 }[]>([])
  const [activeId, setActiveId] = React.useState<string | undefined>()

  React.useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const hs = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    const makeId = (txt: string) => txt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const items = hs.map(h => {
      if (!h.id) h.id = makeId(h.textContent || '')
      const level = h.tagName.toLowerCase() === 'h3' ? 3 : 2
      return { id: h.id, label: h.textContent || '', level: level as 2 | 3 }
    })
    setTocItems(items)

    const compute = () => {
      const viewportMid = window.innerHeight * 0.5
      let active: HTMLElement | null = null
      for (const h of hs) {
        const top = h.getBoundingClientRect().top
        if (top <= viewportMid + 1) active = h
        else break
      }
      setActiveId((active || hs[0])?.id)
    }
    compute()
    const onScroll = () => compute()
    const onResize = () => compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [children])

  // Auto-collapse DesktopTOC after initial scroll past header
  const [tocCollapsed, setTocCollapsed] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return
      const y = window.scrollY || window.pageYOffset
      setTocCollapsed(y > 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
      <Article className="post prose-wrapper">
      <Header className="post-header">
        <TopChips>
          {fm.category && <CategoryLabel className="category">{fm.category}</CategoryLabel>}
          {fm.subcategory && <SubcategoryChip aria-label={`Subcategory: ${fm.subcategory}`}>{fm.subcategory}</SubcategoryChip>}
        </TopChips>
        <Title as={fm.type === 'essay' ? 'h1' : 'h1'} $essay={fm.type === 'essay'}>{fm.title}</Title>
        {(fm.deck || (fm as any).subtitle) && <Deck>{fm.deck || (fm as any).subtitle}</Deck>}
        <MetaRow>
          <div className="left">
            {(fm.tags || fm.topics) && (
              <Tags className="tags">
                {(fm.tags || fm.topics || []).map((t: string) => (
                  <span key={t} className="tag">#{t}</span>
                ))}
              </Tags>
            )}
          </div>
          <div className="right">
            {(fm.date || fm.updated) && (
              <div className="dates">
                {(fm as any).planted_at && <span>Planted {(fm as any).planted_at}</span>}
                {!((fm as any).planted_at) && fm.date && <span>Planted {fm.date}</span>}
                {fm.updated && <span> · Revisited {fm.updated}</span>}
              </div>
            )}
          </div>
        </MetaRow>
      </Header>

      <PostGrid className="post-grid">
        <DesktopRail>
          <StickyRail topOffsetPx={24}>
            <DesktopTOC items={tocItems} activeId={activeId} accentColor="var(--accent)" collapsed={tocCollapsed} />
          </StickyRail>
        </DesktopRail>
        
        <PostBody className="post-body article-body" ref={contentRef as any}>
          {(mapKey?.audience || (fm as any).audience) && (
            <AudienceCard as="section" className="audience" aria-labelledby="audience-label">
              <span id="audience-label" className="label">Assumed audience</span>
              <p className="text">{mapKey?.audience || (fm as any).audience?.description || (fm as any).audience}</p>
            </AudienceCard>
          )}
          <HeadingIndicator forRef={contentRef} />
          {children}
          <PostFooter className="post-footer">
            <FooterNav tags={fm.tags} related={related} prev={prev || undefined} next={next || undefined} />
          </PostFooter>
        </PostBody>
      </PostGrid>
      </Article>
  )
}

const OuterMain = styled.main`
  width: 87.5%; max-width: var(--width); margin: 0 auto; padding: 24px 0 40px;
`

const Article = styled.article``

const Header = styled.header`
  /* Align header axis and width to the body column */
  width: 100%;
  max-width: 760px;
  margin: 0 auto 16px;
  display: grid; gap: 12px;
  @media (min-width: 641px) { gap: 14px; }
  @media (min-width: 1025px) { gap: 16px; margin: 0 auto 20px; }
`

const TopChips = styled.div`
  display: inline-flex; gap: 8px; align-items: center;
`

const CategoryLabel = styled.span`
  text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; color: var(--accent);
`

const SubcategoryChip = styled.span`
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px;
  color: var(--color-text-3);
  border: 1px solid var(--color-divider);
  background: var(--color-card);
  border-radius: 999px; padding: 3px 8px;
`

const Title = styled.h1<{ $essay?: boolean }>`
  font-size: ${p => (p.$essay ? '2.3rem' : '2.0rem')};
  line-height: 1.2;
  font-weight: 800;
  @media (min-width: 641px) { font-size: ${p => (p.$essay ? '2.6rem' : '2.2rem')}; }
  @media (min-width: 1025px) { font-size: ${p => (p.$essay ? '3rem' : '2.6rem')}; }
`

const Deck = styled.p`
  color: var(--color-text-2); font-size: 1.05rem;
  @media (min-width: 641px) { font-size: 1.1rem; }
`

const MetaRow = styled.div`
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px;
  padding: 10px 0; 
  .topics { font-size: 14px; color: var(--color-text-2); }
  .dates { font-size: 12px; color: var(--color-text-3); white-space: nowrap; }
  @media (max-width: 640px) {
    grid-template-columns: 1fr; gap: 6px; align-items: start;
    .right { order: 2; }
  }
`

const Tags = styled.div`
  margin-top: 2px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.875rem;
  .tag { color: var(--accent); }
`

const AudienceCard = styled.div`
  display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start;
  margin: 8px 0 18px; padding: 14px 16px; border: 1px solid var(--color-divider); border-radius: 8px;
  background: var(--color-card);
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--accent); font-weight: 600; }
  .text { margin: 0; color: var(--color-text-2); }
`

const PostGrid = styled.div`
  display: grid; gap: 24px; grid-template-columns: 1fr; align-items: start;
  @media (min-width: 1025px) {
    grid-template-columns: 280px minmax(auto, 700px) 1fr; /* fixed rail to ensure sticky within viewport */
    column-gap: 32px;
    max-width: 1400px; margin: 0 auto; padding: 0 16px;
  }
`
const DesktopRail = styled.div`
  display: none;
  @media (min-width: 1025px) {
    display: block; grid-column: 1; justify-self: start; align-self: stretch; /* ensure parent taller than sticky child */
  }
`

// sticky behavior moved to StickyRail component

const RailSlot = styled.div`
  display: none;
  @media (min-width: 1025px) {
    display: block; grid-column: 2;
  }
`

/* TOC rail removed for now */

const PostBody = styled.div`
  position: relative;
  display: grid; gap: 16px; line-height: 1.7; font-size: 1.06rem;
  width: 100%;
  max-width: 700px; /* centered body measure */
  margin-left: auto; margin-right: auto; /* center on single-column layout */
  padding-left: 20px; /* left gutter for heading indicator */

  /* Rule above the body entry */
  padding-top: 16px;

  /* Drop cap: apply only to explicit intro paragraph */
  p.intro:first-letter {
    float: left;
    font-family: var(--font-serif);
    font-size: 3.2em; line-height: 0.9; font-weight: 700;
    margin: 0.08em 0.14em 0 0; color: var(--color-text);
  }
  @media (max-width: 640px) {
    p.intro:first-letter { font-size: 2.4em; line-height: 0.95; }
  }

  p { color: var(--color-text); margin: 0; }
  p + p { margin-top: 16px; }
  blockquote { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--color-text-2) }
  pre { background: var(--color-code-block); padding: 12px; border-radius: 8px; overflow: auto; }
  code { font-family: var(--font-mono) }

  /* Anchor offset for sticky header */
  h2, h3 { scroll-margin-top: 96px; }

  /* Let media extend slightly beyond the text measure on desktop */
  @media (min-width: 1025px) {
    grid-column: 2; /* central content column */
    img, figure {
      max-width: none;
      width: calc(100% + 36px);
      margin-right: -36px; /* extend to the right only (keep left gutter clear) */
      border-radius: 8px; border: 1px solid var(--color-divider);
    }
  }
`

const PostFooter = styled.footer``

export { TypeChip, StatusChip, FooterNav, DesktopTOC }
