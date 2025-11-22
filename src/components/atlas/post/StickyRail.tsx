import React from 'react'
import styled from 'styled-components'

interface StickyRailProps {
  children: React.ReactNode
  topOffsetPx?: number
}

const StickyRail: React.FC<StickyRailProps> = ({ children, topOffsetPx = 24 }) => {
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const [y, setY] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      // distance before we hit sticky top; positive above threshold
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80
      const clearance = rect.top - (nav + topOffsetPx)
      // Ease by mapping distance into a small translate range (0..14px)
      const t = Math.max(0, Math.min(14, clearance * 0.15))
      setY(t)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [topOffsetPx])

  return (
    <Wrap ref={wrapRef} style={{ transform: `translateY(${y}px)` }} $topOffsetPx={topOffsetPx}>
      {children}
    </Wrap>
  )
}

const Wrap = styled.div<{ $topOffsetPx: number }>`
  position: sticky;
  top: calc(var(--nav-height, 80px) + ${({ $topOffsetPx }) => $topOffsetPx}px);
  align-self: start; z-index: 10;
  transition: transform 180ms ease-out;
`

export default StickyRail


