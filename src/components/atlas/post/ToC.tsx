import React from 'react'
import styled from 'styled-components'

interface TocItem { id: string; text: string; level: number }
interface Props { forRef: React.RefObject<HTMLElement> }

const ToC: React.FC<Props> = ({ forRef }) => {
  const [items, setItems] = React.useState<TocItem[]>([])
  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = React.useState<string>('')

  React.useEffect(() => {
    const root = forRef.current
    if (!root) return
    const hs = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    const toc = hs.map(h => {
      if (!h.id) h.id = h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      const level = h.tagName === 'H3' ? 3 : 2
      return { id: h.id, text: h.textContent || '', level }
    })
    setItems(toc)

    // Scrollspy
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setCurrent((e.target as HTMLElement).id) })
    }, { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] })
    hs.forEach(h => obs.observe(h))
    return () => obs.disconnect()
  }, [forRef])

  if (items.length === 0) return null
  return (
    <Wrap>
      <Summary onClick={() => setOpen(o => !o)} aria-expanded={open}>
        Contents
      </Summary>
      <List $open={open} aria-label="Table of contents">
        {items.map(i => (
          <li key={i.id} className={current === i.id ? 'active' : ''} data-level={i.level}>
            <a href={`#${i.id}`}>{i.text}</a>
          </li>
        ))}
      </List>
    </Wrap>
  )
}

const Wrap = styled.nav`
  position: sticky; top: calc(var(--nav-height) + 16px);
  display: block;
`
const Summary = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--color-text-3);
  border: 1px solid var(--color-divider); border-radius: 999px; padding: 4px 10px;
  background: var(--color-card); cursor: pointer;
`
const List = styled.ul<{ $open: boolean }>`
  margin-top: 8px;
  list-style: none;
  padding-left: 0;
  max-height: ${p => (p.$open ? '400px' : '0')};
  overflow: hidden;
  transition: max-height 200ms ease;
  li { margin: 6px 0; font-size: 13px; }
  li[data-level="3"] { padding-left: 12px; font-size: 12px; }
  a { color: var(--color-text-2); }
  li.active a { color: var(--accent); font-weight: 600; }
  @media (min-width: 960px) {
    max-height: none; overflow: visible;
  }
`

export default ToC

