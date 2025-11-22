import React from 'react'
import styled from 'styled-components'

export interface TocItem { id: string; text: string }
interface Props { forRef: React.RefObject<HTMLElement> }

// Hook: returns single-level TOC (H2 only) and the current active id
function useTOC(forRef: React.RefObject<HTMLElement>) {
  const [items, setItems] = React.useState<TocItem[]>([])
  const [current, setCurrent] = React.useState<string>('')

  React.useEffect(() => {
    const root = forRef.current
    if (!root) return
    const hs = Array.from(root.querySelectorAll('h2')) as HTMLElement[]
    const toc = hs.map(h => {
      if (!h.id) h.id = h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      return { id: h.id, text: h.textContent || '' }
    })
    setItems(toc)

    const compute = () => {
      const viewportMid = window.innerHeight * 0.5
      let active: HTMLElement | null = null
      for (const h of hs) {
        const top = h.getBoundingClientRect().top
        if (top <= viewportMid + 1) active = h
        else break
      }
      setCurrent((active || hs[0])?.id || '')
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
  }, [forRef])

  return { items, current }
}

// Shared list renderer
const TOCList: React.FC<{ items: TocItem[]; current: string; id?: string }> = ({ items, current, id }) => {
  if (items.length === 0) return null
  return (
    <ul id={id} aria-label="Table of contents">
      {items.map(i => (
        <li key={i.id} className={current === i.id ? 'active' : ''}>
          <a href={`#${i.id}`}>{i.text}</a>
        </li>
      ))}
    </ul>
  )
}

// Desktop rail card (visible on desktop only)
export const TOCRail: React.FC<Props> = ({ forRef }) => {
  const { items, current } = useTOC(forRef)
  if (items.length === 0) return null
  return (
    <RailCard className="toc-card" role="region" aria-label="Table of contents">
      <RailHead className="toc-head">
        <Dot aria-hidden="true" />
        <h4>Table of Contents</h4>
      </RailHead>
      <RailNav className="toc">
        <StyledListDesktop>
          <TOCList items={items} current={current} id="toc-desktop" />
        </StyledListDesktop>
      </RailNav>
    </RailCard>
  )
}

// Mobile <details> (visible on tablet/mobile)
export const MobileTOC: React.FC<Props> = ({ forRef }) => {
  const { items, current } = useTOC(forRef)
  if (items.length === 0) return null
  return (
    <MobileDetails className="toc-mobile">
      <summary>Table of Contents</summary>
      <nav className="toc">
        <StyledListMobile>
          <TOCList items={items} current={current} id="toc-mobile" />
        </StyledListMobile>
      </nav>
    </MobileDetails>
  )
}

// Styles
const RailCard = styled.div`
  position: sticky; top: calc(var(--nav-height) + 16px);
  display: none;
  @media (min-width: 1025px) { display: block; }
  border: 1px solid var(--color-divider); border-radius: 10px; background: var(--color-card);
  padding: 12px; color: var(--color-text-2);
`
const RailHead = styled.div`
  display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center; margin-bottom: 8px;
  h4 { font-size: 12px; color: var(--color-text-3); margin: 0; }
`
const Dot = styled.span`
  width: 8px; height: 8px; border-radius: 2px; background: var(--accent); display: inline-block;
`
const RailNav = styled.nav``

const StyledListBase = styled.div`
  ul { list-style: none; margin: 0; padding: 0; }
  li { border-left: 2px solid transparent; }
  a { display: block; padding: 8px 8px 8px 10px; color: var(--color-text-2); text-decoration: none; }
  li.active { border-left-color: var(--accent); }
  li.active a { color: var(--accent); font-weight: 600; }
`
const StyledListDesktop = styled(StyledListBase)`
  a { font-size: 12px; line-height: 1.4; }
`
const StyledListMobile = styled(StyledListBase)`
  a { min-height: 44px; display: flex; align-items: center; font-size: 14px; }
`

const MobileDetails = styled.details`
  display: block;
  @media (min-width: 1025px) { display: none; }
  border: 1px solid var(--color-divider); border-radius: 10px; background: var(--color-card);
  summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 14px; }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '▾'; display: inline-block; transition: transform 180ms ease; }
  &[open] summary::after { transform: rotate(180deg); }
  nav { border-top: 1px solid var(--color-divider); padding: 4px 0; }
`

export type { Props as ToCProps }
