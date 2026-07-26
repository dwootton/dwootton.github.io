import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"

interface SectionSeparatorProps {
  title: string
  href?: string
  actionLabel?: string
  className?: string
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({
  title,
  href,
  actionLabel,
  className,
}) => {
  const titleContent = <Title>{title}</Title>

  return (
    <Wrap className={className}>
      <Inner>
        {href ? (
          <TitleLink to={href} aria-label={title}>
            {titleContent}
          </TitleLink>
        ) : (
          <TitlePlate aria-label={title}>{titleContent}</TitlePlate>
        )}
        {href && actionLabel ? <ActionLink to={href}>{actionLabel}</ActionLink> : null}
      </Inner>
    </Wrap>
  )
}

const Wrap = styled.div`
  width: 100%;
  min-width: 0;
`

const Inner = styled.div`
  position: relative;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: clamp(12px, 2vw, 18px);
`

const plateStyles = css`
  position: relative;
  min-height: 30px;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 17px 0 14px;
  color: var(--atlas-ribbon-text);
  background: var(--atlas-ribbon-bg);
  border: 1px solid var(--atlas-ribbon-stroke);
  clip-path: polygon(8px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 8px 100%, 0 50%);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.18) inset,
    0 5px 14px rgba(48, 39, 28, 0.04);
`

const TitlePlate = styled.span`
  ${plateStyles}
`

const TitleLink = styled(Link)`
  ${plateStyles}

  &:hover {
    color: var(--atlas-ribbon-hover);
  }
`

const Title = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const ActionLink = styled(Link)`
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);

  &:hover {
    color: var(--color-text);
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: none;
  }
`

export default SectionSeparator
