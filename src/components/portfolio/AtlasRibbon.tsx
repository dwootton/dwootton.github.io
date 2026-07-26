import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

interface AtlasRibbonProps {
  className?: string
}

const AtlasRibbon: React.FC<AtlasRibbonProps> = ({ className }) => {
  return (
    <Wrap className={className}>
      <Rule aria-hidden="true" />
      <RibbonLink to="/atlas/" aria-label="Open the Atlas">
        <Frame viewBox="0 0 384 58" preserveAspectRatio="none" aria-hidden>
          <path d="M26 8H338L364 29L338 50H26L8 29L26 8Z" />
          <path d="M26 8L26 50" />
          <path d="M338 8L338 50" />
          <path d="M8 29H0" />
          <path d="M364 29H384" />
        </Frame>
        <span>THE ATLAS</span>
      </RibbonLink>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 58px;
`

const Rule = styled.span`
  position: absolute;
  left: -72px;
  right: -72px;
  top: 50%;
  height: 1px;
  background:
    linear-gradient(90deg, transparent, var(--atlas-ribbon-rule) 12%, var(--atlas-ribbon-rule) 88%, transparent);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    left: -22px;
    right: -22px;
  }
`

const RibbonLink = styled(Link)`
  position: relative;
  z-index: 1;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  min-width: min(100%, 384px);
  height: 58px;
  padding: 0 44px;
  color: var(--atlas-ribbon-text);
  font-family: var(--font-mono);
  font-size: 1.02rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  &:hover {
    color: var(--atlas-ribbon-hover);
  }

  > span {
    position: relative;
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    min-width: min(100%, 342px);
    padding-right: 32px;
    font-size: 0.88rem;
  }
`

const Frame = styled.svg`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: visible;
  pointer-events: none;

  path {
    fill: var(--atlas-ribbon-bg);
    stroke: var(--atlas-ribbon-stroke);
    stroke-width: 1.2;
    vector-effect: non-scaling-stroke;
  }

  path:not(:first-child) {
    fill: none;
    stroke-width: 1;
  }
`

export default AtlasRibbon
