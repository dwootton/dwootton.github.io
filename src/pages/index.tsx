import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import Markdown from "Styles/markdown"
import { rhythm } from "Styles/typography"
import BackgroundParticles from "Components/particles"

const Home = () => {
  const data = useStaticQuery<Queries.Query>(graphql`
    query Home {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/home/" } }) {
        edges {
          node {
            html
          }
        }
      }
    }
  `)

  const markdown = data.allMarkdownRemark.edges[0].node.html

  return (
    <Layout>
      <SEO title="About" />
      <Container rhythm={rhythm}>
        <h5 style={{ textTransform: "uppercase", color: "gray" }}>
          Dylan Wootton
        </h5>
        <h1>Interaction Designer and Researcher</h1>
        <div dangerouslySetInnerHTML={{ __html: markdown ?? "" }}></div>
      </Container>
    </Layout>
  )
}

const Container = styled(Markdown).attrs({
  as: "main",
})`
  width: var(--post-width);
  margin: 0 auto;
  margin-top: 80px;
  margin-bottom: 6rem;
  @media (max-width: ${({ theme }) => theme.device.sm}) {
    margin-top: var(--sizing-xl);
    width: 87.5%;
  }
  h1 {
    margin-bottom: 2rem;
  }
  h2 {
    margin-top: var(--sizing-lg);
    @media (max-width: ${({ theme }) => theme.device.sm}) {
      font-size: 1.75rem;
    }
  }
  h3 {
    @media (max-width: ${({ theme }) => theme.device.sm}) {
      font-size: 1.25rem;
    }
  }
`

export default Home
