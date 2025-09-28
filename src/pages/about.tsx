import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'

import Layout from 'Layouts/layout'
import SEO from 'Components/seo'
import Markdown from 'Styles/markdown'

const AboutPage: React.FC = () => {
  const data = useStaticQuery<Queries.Query>(graphql`
    query AboutPageQuery {
      about: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/(posts/about)/" } }) {
        edges { node { html } }
      }
    }
  `)

  const html = data.about.edges[0]?.node.html || ''

  return (
    <Layout>
      <SEO title="About" />
      <Main as="main">
        <h1>About</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Main>
    </Layout>
  )
}

const Main = styled(Markdown)`
  width: var(--post-width);
  margin: 0 auto;
  padding: 32px 0 64px;
  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: 87.5%;
  }
  h1 { font-size: 2rem; font-weight: 800; margin-bottom: 16px; }
`

export default AboutPage

