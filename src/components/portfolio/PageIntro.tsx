import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import CoordinateLabel from "./CoordinateLabel"

interface PageIntroProps {
  label: string
  title: string
  description?: string
  coordinate?: string
  align?: "narrow" | "wide"
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
}

const PageIntro: React.FC<PageIntroProps> = ({
  label,
  title,
  description,
  coordinate,
  align = "narrow",
  backHref,
  backLabel = "Back",
  children,
}) => {
  const normalizedLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "")
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "")
  const showLabel = Boolean(label) && normalizedLabel !== normalizedTitle
  const showEyebrowRow = showLabel || Boolean(coordinate)

  return (
    <Wrap $align={align}>
      {backHref ? (
        <TopRow>
          <BackLink to={backHref}>{backLabel}</BackLink>
        </TopRow>
      ) : null}
      {showEyebrowRow ? (
        <EyebrowRow>
          {showLabel ? <Label>{label}</Label> : null}
          {coordinate ? <Coordinate coordinate={coordinate} /> : null}
        </EyebrowRow>
      ) : null}
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {children}
    </Wrap>
  )
}

const Wrap = styled.header<{ $align: "narrow" | "wide" }>`
  width: min(100%, ${p => (p.$align === "wide" ? "960px" : "780px")});
  max-width: 100%;
  min-width: 0;
  display: grid;
  gap: 12px;
`

const TopRow = styled.div`
  min-width: 0;
  display: block;
`

const BackLink = styled(Link)`
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--color-text-3);

  &:hover {
    color: var(--accent);
  }
`

const EyebrowRow = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
`

const Label = styled.span`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  color: var(--color-text-3);
  text-transform: uppercase;
`

const Coordinate = styled(CoordinateLabel)`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-text-3);
  overflow-wrap: anywhere;
`

const Title = styled.h1`
  font-size: clamp(3.15rem, 7vw, 5.8rem);
  line-height: 0.96;
  letter-spacing: 0;
  max-width: 12ch;
  min-width: 0;
  overflow-wrap: break-word;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    font-size: clamp(2.65rem, 13vw, 3.7rem);
  }
`

const Description = styled.p`
  min-width: 0;
  max-width: 56rem;
  font-size: clamp(1.08rem, 1.7vw, 1.45rem);
  line-height: 1.45;
  color: var(--color-text-2);
  overflow-wrap: break-word;
`

export default PageIntro
