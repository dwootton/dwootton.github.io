import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageIntro from "Components/portfolio/PageIntro"

const NotFound = () => {
  return (
    <Layout>
      <SEO title="Not found" />
      <PageWrap>
        <PageIntro
          label="404"
          title="This page fell off the map."
          description="The route you followed does not point to a live page in the current portfolio system."
        />
        <ReturnCard>
          <ReturnLink to="/">Return to the homepage</ReturnLink>
        </ReturnCard>
      </PageWrap>
    </Layout>
  )
}

const PageWrap = styled.div`
  width: var(--site-content-width);
  margin: 0 auto;
  padding: 56px 0 72px;
  display: grid;
  gap: 26px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: var(--site-content-width);
    padding: 42px 0 56px;
  }
`

const ReturnCard = styled.div`
  width: fit-content;
  padding: 16px 18px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--color-card);
`

const ReturnLink = styled(Link)`
  color: var(--accent);

  &:hover {
    text-decoration: underline;
  }
`

export default NotFound
