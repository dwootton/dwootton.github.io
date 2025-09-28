import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import Markdown from "Styles/markdown"
import { rhythm } from "Styles/typography"
import { getImage } from "gatsby-plugin-image"
import HomeCard from "Components/home/HomeCard"

const Home = () => {
  const data = useStaticQuery<Queries.Query>(graphql`
    query Home {
      home: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/home/" } }) {
        edges { node { html } }
      }
      projects: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(posts/projects)/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              desc
              thumbnail { childImageSharp { gatsbyImageData(width: 640, placeholder: BLURRED, aspectRatio: 1.5) } }
            }
            fields { slug }
          }
        }
      }
    }
  `)

  const markdown = data.home.edges[0]?.node.html
  // Compact hero: auto height so content flows quickly

  const posts = React.useMemo(() => (data.projects?.edges || []).map(({ node }: any) => ({
    id: node.id,
    title: node.frontmatter?.title,
    date: node.frontmatter?.date,
    desc: node.frontmatter?.desc,
    slug: node.fields?.slug,
    img: getImage(node.frontmatter?.thumbnail?.childImageSharp),
  })), [data.projects])
  const essays = posts.slice(0, 4)
  const notes = posts.slice(4, 10)

  return (
    <Layout>
      <SEO title="Home" />
      <HeroWrap>
        <HeroGrid>
          <H1>Dylan builds interactive systems that help people make sense of data.</H1>
          <Subline>HCI researcher and Interaction designer</Subline>
          <BodyCopy>
            My work explores the boundary between rigid computational formalisms and the softer, exploratory reasoning of analysts. I’m currently PhD’ing at
            {' '}<a href="https://vis.csail.mit.edu/" target="_blank" rel="noreferrer">MIT</a> working with {' '}
            <a href="https://arvindsatya.com/" target="_blank" rel="noreferrer">Arvind Satyanarayan</a>.
          </BodyCopy>
        </HeroGrid>
      </HeroWrap>

      <AtlasHeaderLink to="/atlas/">The Atlas</AtlasHeaderLink>
      <Sections>
        {[
          { id: 'essays', title: 'Essays', explainer: 'Papers, essays, and long-form arguments on interaction.' },
          { id: 'guides', title: 'Guideposts', explainer: 'Reusable techniques and patterns.' },
          { id: 'prototypes', title: 'Prototypes', explainer: 'Code and prototypes with write-ups.' },
          { id: 'field', title: 'Field Notes', explainer: 'Shorter thoughts and provisional ideas.' },
        ].map((sec, idx) => {
          const items = posts.slice(idx*3, idx*3 + 3)
          if (items.length === 0) return null
          return (
          <Section key={sec.id}>
            <SectionHead>
              <Link to="/atlas/"><h3>{sec.title} →</h3></Link>
              <p>{sec.explainer}</p>
            </SectionHead>
            {sec.id === 'essays' ? (
              <Cards>
                {items.map((p) => (
                  <HomeCard
                    key={p.id}
                    title={p.title}
                    desc={p.desc}
                    slug={p.slug || '#'}
                    date={p.date}
                    type={'Essay'}
                    image={p.img}
                  />
                ))}
              </Cards>
            ) : (
              <SimpleList>
                {items.map((p) => (
                  <li key={p.id}>
                    <Link to={p.slug || '#'}>{p.title}</Link>
                    {p.desc && <span className="muted"> — {p.desc}</span>}
                  </li>
                ))}
              </SimpleList>
            )}
          </Section>
        )})}
      </Sections>
    </Layout>
  )
}

const Container = styled(Markdown).attrs({
  as: "main",
})`
  width: var(--post-width);
  margin: 0 auto;
  margin-top: 40px;
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

const HeroWrap = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
  padding: 32px 0;
  width: 87.5%;
  max-width: var(--width);
  margin: 60px auto;
`

const HeroGrid = styled.div`
  display: grid;
  gap: 14px;
`

/* CTA row removed per request */

const Sections = styled.section`
  width: 87.5%; max-width: var(--width); margin: 32px auto 64px;
  display: grid; gap: 24px; grid-template-columns: 1fr; align-items: start;
  @media (min-width: 1024px) { grid-template-columns: 1fr 1fr; gap: 28px; }
`

const Col = styled.div`display: grid; gap: 16px;`

const SectionHead = styled.header`
  display: grid; gap: 4px;
  h3 { font-weight: 800; display: inline; }
  p { color: var(--color-text-3); font-size: 13px; }
  a { color: var(--color-text); text-decoration: underline; }
`

const Cards = styled.div`
  display: grid; gap: 16px; grid-template-columns: 1fr;
  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
`

const SimpleList = styled.ul`
  list-style: none; padding: 0; margin: 0; display: grid; gap: 10px;
  li { padding: 6px 0; border-bottom: 1px solid var(--color-divider); }
  a { color: var(--color-text); }
  .muted { color: var(--color-text-3); }
`

/* Old Card styles removed in favor of HomeCard */

/* Old Thumb removed */

/* Old NotesList removed */

const Name = styled.h5`
  text-transform: uppercase; color: gray; letter-spacing: .08em;
`

const H1 = styled.h1`
  font-size: 2.4rem; font-weight: 800; line-height: 1.15; margin-bottom: 4px;
  @media (min-width: 1024px) { font-size: 3rem; }
`

const BodyCopy = styled.p`
  color: var(--color-text-2); max-width: 80ch; line-height: 1.6; margin-top: 4px;
`

/* Motif removed from homepage */

const Subline = styled.p`
  color: var(--color-text-3);
`

const AtlasHeaderLink = styled(Link)`
  width: 87.5%; max-width: var(--width); margin: 24px auto 8px; display: block;
  font-weight: 800; font-size: 1.75rem; color: var(--color-text);
  @media (min-width: 1024px) { font-size: 2rem; }
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

// Section wrapper for home categories
const Section = styled.section`
  display: grid; gap: 12px; padding: 8px 0; margin-bottom: 48px;
  @media (min-width: 1024px) { margin-bottom: 64px; }
`

function hashToXY(slug: string) {
  // Deterministic hash → pseudo-random point in [-1,1]^2
  let h1 = 2166136261, h2 = 388650253
  for (let i = 0; i < slug.length; i++) {
    h1 ^= slug.charCodeAt(i); h1 = Math.imul(h1, 16777619)
    h2 ^= slug.charCodeAt(slug.length - 1 - i); h2 = Math.imul(h2, 2246822519)
  }
  const f = (x: number) => ((x >>> 0) / 0xffffffff) * 2 - 1
  const x = f(h1), y = f(h2)
  return { x, y }
}

function timeSince(iso?: string) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  const units: [number, string][] = [
    [60*60*24*365, 'y'],
    [60*60*24*30, 'mo'],
    [60*60*24*7, 'w'],
    [60*60*24, 'd'],
    [60*60, 'h'],
    [60, 'm'],
  ]
  for (const [sec, label] of units) {
    const v = Math.floor(s / sec)
    if (v >= 1) return `${v}${label} ago`
  }
  return 'just now'
}

export default Home
