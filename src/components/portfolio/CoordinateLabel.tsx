import React from "react"
import styled from "styled-components"

import { baseCoordinate, coordinatePlace } from "./content"

interface CoordinateLabelProps {
  coordinate?: string
  place?: string
  className?: string
}

const CoordinateLabel: React.FC<CoordinateLabelProps> = ({
  coordinate = baseCoordinate,
  place = coordinatePlace,
  className,
}) => {
  return (
    <Wrap
      className={className}
      tabIndex={0}
      aria-label={`${coordinate}. ${place}`}
      data-tooltip={place}
    >
      {coordinate}
    </Wrap>
  )
}

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  cursor: help;

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 10px);
    transform: translate(-50%, 4px);
    z-index: 30;
    padding: 6px 8px;
    border: 1px solid var(--card-border);
    border-radius: 3px;
    background: var(--surface);
    color: var(--color-text);
    box-shadow: 0 8px 20px var(--shadow);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    line-height: 1;
    opacity: 0;
    pointer-events: none;
    text-transform: uppercase;
    white-space: nowrap;
    transition: opacity 140ms ease, transform 140ms ease;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`

export default CoordinateLabel
