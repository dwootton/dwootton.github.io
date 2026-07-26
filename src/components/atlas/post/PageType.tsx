import React from 'react'
import styled from 'styled-components'
import TypeChip from './TypeChip'
import StatusChip from './StatusChip'
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

    if (!hs.length || typeof IntersectionObserver === 'undefined') {
      setActiveId(undefined)
      return
    }

    let frame = 0

    const compute = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const activationY = window.innerHeight * 0.32
        let active: HTMLElement | null = hs[0]

        for (const h of hs) {
          const top = h.getBoundingClientRect().top
          if (top <= activationY + 1) active = h
          else break
        }

        setActiveId(active?.id)
      })
    }

    const observer = new IntersectionObserver(compute, {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0,
    })

    hs.forEach(h => observer.observe(h))
    compute()

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(compute)

    resizeObserver?.observe(root)
    window.addEventListener('resize', compute)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [children])

  return (
      <Article className="post prose-wrapper">
      <PostGrid className="post-grid">
        <DesktopRail>
          <StickyRail topOffsetPx={24}>
            <DesktopTOC items={tocItems} activeId={activeId} accentColor="var(--survey-marker)" />
          </StickyRail>
        </DesktopRail>
        
        <ContentColumn>
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
        </ContentColumn>
      </PostGrid>
      </Article>
  )
}

const OuterMain = styled.main`
  width: 87.5%; max-width: var(--width); margin: 0 auto; padding: 24px 0 40px;
`

const Article = styled.article`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
`

const ContentColumn = styled.div`
  grid-column: 1;
  min-width: 0; /* Critical: allows flex/grid items to shrink below content width */
  max-width: 100%;
  overflow-x: hidden;
  
  @media (min-width: 1025px) {
    grid-column: 2;
    overflow-x: visible;
  }
`

const Header = styled.header`
  /* Align header axis and width to the body column */
  width: 100%;
  max-width: 100%; /* Don't exceed parent width on mobile */
  margin: 0 auto 16px;
  display: grid; gap: 10px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  
  @media (min-width: 480px) {
    gap: 12px;
  }
  
  @media (min-width: 641px) { 
    gap: 14px; 
  }
  
  @media (min-width: 641px) {
    max-width: 700px; /* Start limiting width on tablets */
  }
  
  @media (min-width: 1025px) { 
    gap: 16px; 
    margin: 0 0 20px 0; /* Remove auto margins on desktop to align with grid */
    max-width: 100%; /* Use full column width */
  }
  
  @media (min-width: 1280px) {
    max-width: 700px; /* Limit width on larger screens for readability */
  }
`

const TopChips = styled.div`
  display: inline-flex; gap: 8px; align-items: center;
`

const CategoryLabel = styled.span`
  text-transform: uppercase; 
  font-size: 10px; 
  letter-spacing: 0.06em; 
  color: var(--accent);
  
  @media (min-width: 480px) {
    font-size: 11px;
    letter-spacing: 0.07em;
  }
  
  @media (min-width: 641px) {
    font-size: 12px;
    letter-spacing: 0.08em;
  }
`

const SubcategoryChip = styled.span`
  display: inline-flex; 
  align-items: center; 
  gap: 4px; 
  font-size: 10px;
  color: var(--color-text-3);
  border: 1px solid var(--color-divider);
  background: var(--color-card);
  border-radius: 999px; 
  padding: 2px 6px;
  
  @media (min-width: 480px) {
    font-size: 11px;
    gap: 5px;
    padding: 2px 7px;
  }
  
  @media (min-width: 641px) {
    font-size: 12px;
    gap: 6px;
    padding: 3px 8px;
  }
`

const Title = styled.h1<{ $essay?: boolean }>`
  font-size: ${p => (p.$essay ? '1.75rem' : '1.5rem')};
  line-height: 1.15;
  font-weight: 800;
  
  @media (min-width: 480px) {
    font-size: ${p => (p.$essay ? '2rem' : '1.75rem')};
    line-height: 1.2;
  }
  
  @media (min-width: 641px) { 
    font-size: ${p => (p.$essay ? '2.6rem' : '2.2rem')}; 
  }
  
  @media (min-width: 1025px) { 
    font-size: ${p => (p.$essay ? '3rem' : '2.6rem')}; 
  }
`

const Deck = styled.p`
  color: var(--color-text-2); 
  font-size: 0.95rem;
  line-height: 1.4;
  
  @media (min-width: 480px) {
    font-size: 1rem;
  }
  
  @media (min-width: 641px) { 
    font-size: 1.1rem; 
  }
`

const MetaRow = styled.div`
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 6px; 
  align-items: start;
  padding: 8px 0;
  
  .topics { font-size: 12px; color: var(--color-text-2); }
  .dates { font-size: 11px; color: var(--color-text-3); }
  .right { order: -1; } /* Dates first on mobile */
  
  @media (min-width: 480px) {
    padding: 10px 0;
    gap: 8px;
    .topics { font-size: 13px; }
    .dates { font-size: 11px; }
  }
  
  @media (min-width: 641px) {
    grid-template-columns: 1fr auto; 
    align-items: center; 
    gap: 12px;
    .topics { font-size: 14px; }
    .dates { font-size: 12px; white-space: nowrap; }
    .right { order: 0; } /* Reset order */
  }
`

const Tags = styled.div`
  margin-top: 2px; 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  font-size: 0.75rem;
  
  .tag { color: var(--accent); }
  
  @media (min-width: 480px) {
    font-size: 0.8rem;
    gap: 9px;
  }
  
  @media (min-width: 641px) {
    font-size: 0.875rem;
    gap: 10px;
  }
`

const AudienceCard = styled.div`
  display: grid; 
  grid-template-columns: 1fr; /* Stack on mobile */
  gap: 8px; 
  align-items: start;
  margin: 8px 0 16px; 
  padding: 12px 14px; 
  border: 1px solid var(--color-divider); 
  border-radius: 8px;
  background: var(--color-card);
  
  .label { 
    font-size: 10px; 
    text-transform: uppercase; 
    letter-spacing: 0.03em; 
    color: var(--accent); 
    font-weight: 600; 
  }
  .text { 
    margin: 0; 
    color: var(--color-text-2);
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  @media (min-width: 480px) {
    grid-template-columns: auto 1fr; /* Side by side on larger screens */
    gap: 12px;
    padding: 12px 16px;
    .label { font-size: 11px; }
    .text { font-size: 0.9rem; }
  }
  
  @media (min-width: 641px) {
    gap: 16px;
    padding: 14px 16px;
    margin: 8px 0 18px;
    .text { font-size: 1rem; }
  }
`

const PostGrid = styled.div`
  display: grid; 
  gap: 24px; 
  grid-template-columns: 1fr; 
  align-items: start;
  padding: 0 16px; /* Mobile padding */
  width: 100%;
  max-width: 100vw; /* Prevent horizontal overflow */
  overflow-x: hidden; /* Hide any overflow */
  box-sizing: border-box;
  
  @media (min-width: 640px) {
    padding: 0 24px;
  }
  
  @media (min-width: 1025px) {
    grid-template-columns: 200px 1fr; /* rail + content */
    column-gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    overflow-x: visible; /* Allow overflow on desktop */
  }
  @media (min-width: 1280px) {
    grid-template-columns: 240px 1fr;
    column-gap: 60px;
    max-width: 1280px;
  }
`
const DesktopRail = styled.div`
  display: none;
  @media (min-width: 1025px) {
    display: block; 
    grid-column: 1; 
    justify-self: start; 
    align-self: start; /* Align to start so sticky works properly */
    position: relative;
    height: 100%;
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
  display: grid; gap: 14px; 
  line-height: 1.6; 
  font-size: 0.95rem;
  width: 100%;
  max-width: 100%; /* Don't exceed parent width on mobile */
  margin: 0 auto; /* center on mobile */
  word-wrap: break-word; /* Force text wrapping */
  overflow-wrap: break-word; /* Modern property for text wrapping */
  word-break: break-word; /* Additional word breaking */
  hyphens: auto; /* Allow hyphenation on mobile */
  overflow-x: hidden; /* Hide horizontal overflow */
  box-sizing: border-box;

  /* Rule above the body entry */
  padding-top: 16px;
  /* No left padding on mobile/tablet - aligns with header */
  
  @media (min-width: 480px) {
    font-size: 1rem;
    line-height: 1.65;
    gap: 15px;
  }
  
  @media (min-width: 641px) {
    font-size: 1.06rem;
    line-height: 1.7;
    gap: 16px;
    max-width: 700px; /* Start limiting width on tablets */
    hyphens: none; /* Disable hyphenation on larger screens */
  }
  
  @media (min-width: 1025px) {
    margin: 0; /* align to start of column on desktop */
    /* No left padding even on desktop to keep alignment consistent */
  }

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

  p { 
    color: var(--color-text); 
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  p + p { margin-top: 16px; }
  blockquote { 
    border-left: 3px solid var(--accent); 
    padding-left: 12px; 
    color: var(--color-text-2);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  pre { 
    background: var(--color-code-block); 
    padding: 12px; 
    border-radius: 8px; 
    overflow-x: auto; /* Allow horizontal scroll for code */
    max-width: calc(100vw - 32px); /* Account for padding on mobile */
    margin-left: -16px;
    margin-right: -16px;
    
    @media (min-width: 640px) {
      max-width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
  code { 
    font-family: var(--font-mono);
    word-break: break-word; /* Break long code strings */
  }

  /* Anchor offset for sticky header */
  h2, h3 { scroll-margin-top: 96px; }

  /* Ensure all content respects mobile width */
  * {
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
  }
  
  /* Long words should break */
  h1, h2, h3, h4, h5, h6 {
    word-break: break-word;
    hyphens: auto;
  }
  
  /* Ensure images don't overflow on mobile */
  img, figure {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid var(--color-divider);
  }
  
  /* Lists should also wrap properly */
  ul, ol {
    padding-left: 20px;
    li {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  /* Let media extend slightly beyond the text measure on desktop */
  @media (min-width: 1025px) {
    grid-column: 2; /* central content column */
    img, figure {
      max-width: none;
      width: calc(100% + 36px);
      margin-right: -36px; /* extend to the right only (keep left gutter clear) */
    }
  }
`

const PostFooter = styled.footer``

export { TypeChip, StatusChip, FooterNav, DesktopTOC }
