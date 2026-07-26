import React from 'react'
import styled from 'styled-components'

interface StickyRailProps {
  children: React.ReactNode
  topOffsetPx?: number
}

const StickyRail: React.FC<StickyRailProps> = ({ children, topOffsetPx = 24 }) => {
  return <Wrap $topOffsetPx={topOffsetPx}>{children}</Wrap>
}

const Wrap = styled.div<{ $topOffsetPx: number }>`
  position: sticky;
  top: calc(var(--nav-height, 80px) + ${({ $topOffsetPx }) => $topOffsetPx}px);
  align-self: start;
  z-index: 10;
  max-height: calc(100vh - var(--nav-height, 80px) - ${({ $topOffsetPx }) => $topOffsetPx + 40}px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-divider);
    border-radius: 4px;
  }
`

export default StickyRail
