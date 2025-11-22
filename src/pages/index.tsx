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
      essays: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/essays/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              desc
              category
              tags
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

  // Process essays from markdown files
  const essays = React.useMemo(() => (data.essays?.edges || []).map(({ node }: any) => ({
    id: node.id,
    title: node.frontmatter?.title,
    date: node.frontmatter?.date,
    desc: node.frontmatter?.desc,
    category: node.frontmatter?.category,
    slug: node.fields?.slug,
    img: getImage(node.frontmatter?.thumbnail?.childImageSharp),
  })), [data.essays])

  // For now, we'll use empty arrays for other content types until we have proper MDX content
  const guides: any[] = []
  const prototypes: any[] = []
  const fieldNotes: any[] = []

  return (
    <Layout>
      <SEO title="Home" />
      <HeroWrap>
        <HeroGrid>
          <H1>
            <NameEmphasis>Dylan</NameEmphasis> builds interactive systems that make information explorable.
          </H1>
          <Subline>HCI and VIS researcher. PhD'ing at MIT.</Subline>
          {/* <BodyCopy>
            My work explores the boundary between rigid computational formalisms and the softer, exploratory reasoning of analysts. I’m currently PhD’ing at
            {' '}<a href="https://vis.csail.mit.edu/" target="_blank" rel="noreferrer">MIT</a> working with {' '}
            <a href="https://arvindsatya.com/" target="_blank" rel="noreferrer">Arvind Satyanarayan</a>.
          </BodyCopy> */}
        </HeroGrid>
      </HeroWrap>

      <AtlasHeaderLink to="/atlas/">The Atlas</AtlasHeaderLink>
      <AtlasSubline style={{ display: "block", marginBottom: "1.5rem", color: "var(--color-text-2)", fontSize: "1.08rem" }}>
        A <span style={{ color: "var(--color-text-3)" }}>(WIP)</span>  compendium of interactive essays, prototypes, and field notes.
      </AtlasSubline>
      <Sections>
        {[
          { id: 'essays', title: 'Essays', explainer: 'Papers, essays, and long-form arguments on interaction.', items: essays },
          { id: 'guides', title: 'Guideposts', explainer: 'Reusable techniques and patterns.', items: guides },
          { id: 'prototypes', title: 'Prototypes', explainer: 'Code and prototypes with write-ups.', items: prototypes },
          { id: 'field', title: 'Field Notes', explainer: 'Shorter thoughts and provisional ideas.', items: fieldNotes },
        ].map((sec) => {
          if (sec.items.length === 0) return null
          return (
          <Section key={sec.id}>
            <SectionHead>
              <Link to="/atlas/"><h3>{sec.title} →</h3></Link>
              <p>{sec.explainer}</p>
            </SectionHead>
            {sec.id === 'essays' ? (
              <Cards>
                {sec.items.map((p) => (
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
                {sec.items.map((p) => (
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
  gap: 12px;
  align-items: start;
  padding: 24px 0;
  width: 90%;
  max-width: var(--width);
  margin: 32px auto;
  
  @media (min-width: 480px) {
    gap: 14px;
    padding: 28px 0;
    margin: 40px auto;
  }
  
  @media (min-width: 641px) {
    gap: 16px;
    padding: 32px 0;
    width: 87.5%;
    margin: 60px auto;
  }
`

const HeroGrid = styled.div`
  display: grid;
  gap: 14px;
`

/* CTA row removed per request */

const Sections = styled.section`
  width: 90%; 
  max-width: var(--width); 
  margin: 24px auto 48px;
  display: grid; 
  gap: 20px; 
  grid-template-columns: 1fr; 
  align-items: start;
  
  @media (min-width: 480px) {
    gap: 22px;
    margin: 28px auto 52px;
  }
  
  @media (min-width: 641px) {
    width: 87.5%;
    gap: 24px;
    margin: 32px auto 64px;
  }
  
  @media (min-width: 1024px) { 
    grid-template-columns: 1fr 1fr; 
    gap: 28px; 
  }
`

const Col = styled.div`display: grid; gap: 16px;`

const SectionHead = styled.header`
  display: grid; 
  gap: 4px;
  
  h3 { 
    font-weight: 800; 
    display: inline;
    font-size: 1.1rem;
  }
  
  p { 
    color: var(--color-text-3); 
    font-size: 12px;
    line-height: 1.3;
  }
  
  a { 
    color: var(--color-text); 
    text-decoration: underline; 
  }
  
  @media (min-width: 480px) {
    h3 { font-size: 1.2rem; }
    p { font-size: 12px; }
  }
  
  @media (min-width: 641px) {
    h3 { font-size: 1.3rem; }
    p { font-size: 13px; }
  }
`

const Cards = styled.div`
  display: grid; 
  gap: 12px; 
  grid-template-columns: 1fr;
  
  @media (min-width: 480px) {
    gap: 14px;
  }
  
  @media (min-width: 641px) {
    gap: 16px;
  }
  
  @media (min-width: 720px) { 
    grid-template-columns: 1fr 1fr; 
  }
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
  font-size: 1.5rem; 
  font-weight: 600; 
  line-height: 1.2; 
  margin-bottom: 4px;
  
  @media (min-width: 480px) {
    font-size: 1.75rem;
    line-height: 1.18;
  }
  
  @media (min-width: 641px) {
    font-size: 2.4rem;
    line-height: 1.15;
  }
  
  @media (min-width: 1024px) { 
    font-size: 3rem; 
  }
`

const NameEmphasis = styled.span`
  font-weight: 800;
`

const BodyCopy = styled.p`
  color: var(--color-text-2); max-width: 80ch; line-height: 1.6; margin-top: 4px;
`

/* Motif removed from homepage */

const Subline = styled.p`
  color: var(--color-text-3);
  font-size: 0.875rem;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 641px) {
    font-size: 1rem;
  }
`

const AtlasHeaderLink = styled(Link)`
  width: 90%; 
  max-width: var(--width); 
  margin: 20px auto 8px; 
  display: block;
  font-weight: 800; 
  font-size: 1.25rem; 
  color: var(--color-text);
  text-decoration: none;
  
  &:hover { text-decoration: underline; }
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 641px) {
    width: 87.5%;
    margin: 24px auto 8px;
    font-size: 1.75rem;
  }
  
  @media (min-width: 1024px) { 
    font-size: 2rem; 
  }
`

const AtlasSubline = styled.p`
  width: 90%; 
  max-width: var(--width); 
  margin: 0 auto 16px; 
  display: block;
  font-weight: 300; 
  font-size: 0.875rem; 
  line-height: 1.4;
  color: var(--color-text-2);
  text-decoration: none;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 641px) {
    width: 87.5%;
    margin: 0 auto 24px;
    font-size: 1.08rem;
  }
  
  @media (min-width: 1024px) { 
    font-size: 1.2rem; 
  }
`

// Section wrapper for home categories
const Section = styled.section`
  display: grid; 
  gap: 10px; 
  padding: 6px 0; 
  margin-bottom: 32px;
  
  @media (min-width: 480px) {
    gap: 11px;
    padding: 7px 0;
    margin-bottom: 40px;
  }
  
  @media (min-width: 641px) {
    gap: 12px;
    padding: 8px 0;
    margin-bottom: 48px;
  }
  
  @media (min-width: 1024px) { 
    margin-bottom: 64px; 
  }
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
