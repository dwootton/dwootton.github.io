import React from 'react'
import styled from 'styled-components'

interface Props { forRef: React.RefObject<HTMLElement> }

// Shared hook to compute active heading id and y-offset using a single rule
function useActiveHeading(forRef: React.RefObject<HTMLElement>) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [y, setY] = React.useState<number | null>(null)
  const [visible, setVisible] = React.useState(false)
  const rafRef = React.useRef<number | null>(null)

  const compute = React.useCallback(() => {
    const root = forRef.current
    if (!root) return
    const headings = Array.from(root.querySelectorAll<HTMLElement>('h2, h3'))
    if (headings.length === 0) { setVisible(false); return }
    setVisible(true)

    headings.forEach(h => { if (!h.id) h.id = (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })

    const viewportMid = window.innerHeight * 0.5 // 50%
    let active: HTMLElement | null = null
    for (const h of headings) {
      const top = h.getBoundingClientRect().top
      if (top <= viewportMid + 1) active = h
      else break
    }
    if (!active) active = headings[0]
    setActiveId(active.id || null)

    const mainRect = root.getBoundingClientRect()
    const hRect = active.getBoundingClientRect()
    // Align marker to the vertical middle of the active heading
    const markerHalf = 5 // marker height is 10px
    const nextY = Math.round((hRect.top - mainRect.top) + (hRect.height / 2) - markerHalf)
    setY(nextY)
  }, [forRef])

  React.useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        compute()
      })
    }
    const onResize = () => compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [compute])

  return { activeId, y, visible }
}

// Tracks the active heading and positions a square in the left gutter
const HeadingIndicator: React.FC<Props> = ({ forRef }) => {
  const { y, visible } = useActiveHeading(forRef)
  if (!visible || y == null) return null
  return <Marker style={{ transform: `translateY(${y}px)` }} aria-hidden="true" />
}

const Marker = styled.div`
  position: absolute; top: 0; left: 0;
  width: 10px; height: 10px; border-radius: 2px;
  background: var(--accent);
  transform: translateY(0);
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  /* Slight glow for visibility on images */
  box-shadow: 0 0 0 2px var(--color-post-background);
`

export default HeadingIndicator
