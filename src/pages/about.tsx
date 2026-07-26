import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageIntro from "Components/portfolio/PageIntro"
import { contactHref } from "Components/portfolio/content"
import Markdown from "Styles/markdown"
import { rhythm } from "Styles/typography"

const AboutPage: React.FC = () => {
  const data = useStaticQuery<Queries.Query>(graphql`
    query AboutPageQuery {
      about: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/content/pages/about/" } }) {
        edges { node { html } }
      }
    }
  `)

  const html = data.about.edges[0]?.node.html || ""

  return (
    <Layout>
      <SEO title="About" />
      <PageWrap>
        <PageIntro
          label="ABOUT"
          title="About"
          description="I study intermediate representations for exploratory data analysis, interaction, and AI-supported learning."
        />

        <ContentGrid>
          <ArticleCard>
            <Markdown rhythm={rhythm} dangerouslySetInnerHTML={{ __html: html }} />
          </ArticleCard>
          <Rail>
            <RailCard>
              <RailLabel>FOCUS</RailLabel>
              <RailList>
                <li>Exploratory data analysis</li>
                <li>Interaction grammars</li>
                <li>Notebook analysis IRs</li>
                <li>AI-supported apprenticeship</li>
              </RailList>
            </RailCard>
            <RailCard>
              <RailLabel>CURRENTLY</RailLabel>
              <RailText>
                PhD student at MIT CSAIL; visiting HCI researcher at AI2 this summer.
              </RailText>
            </RailCard>
            <RailCard>
              <RailLabel>CONTACT</RailLabel>
              <ContactLink href={contactHref}>dwootton@mit.edu</ContactLink>
            </RailCard>
          </Rail>
        </ContentGrid>
      </PageWrap>
    </Layout>
  )
}

const PageWrap = styled.div`
  width: var(--site-content-width);
  margin: 0 auto;
  padding: 56px 0 72px;
  display: grid;
  gap: 36px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: var(--site-content-width);
    padding: 42px 0 56px;
  }
`

const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    grid-template-columns: 1fr;
  }
`

const ArticleCard = styled.section`
  padding: 30px clamp(20px, 3vw, 38px);
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--color-card);
  box-shadow:
    0 1px 2px var(--shadow),
    0 8px 24px var(--shadow);
`

const Rail = styled.aside`
  display: grid;
  gap: 18px;
  align-content: start;
`

const RailCard = styled.section`
  padding: 18px 18px 20px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--color-card);
`

const RailLabel = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  color: var(--color-text-3);
  text-transform: uppercase;
`

const RailList = styled.ul`
  display: grid;
  gap: 12px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--color-text-2);

  li {
    list-style: none;
  }
`

const RailText = styled.p`
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-text-2);
`

const ContactLink = styled.a`
  font-size: 0.96rem;
  color: var(--accent);

  &:hover {
    text-decoration: underline;
  }
`

export default AboutPage
