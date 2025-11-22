import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { navigate } from "gatsby"
import Layout from "Layouts/layout"
import SEO from "Components/seo"
import ItemCard from "Components/atlas/ItemCard"
import type { AtlasItem } from "Components/atlas/types"

interface AtlasPageProps {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          id: string
          frontmatter: {
            title: string
            subtitle?: string
            desc?: string
            category?: string
            subcategory?: string
            date?: string
            tags?: string[]
            thumbnail?: {
              childImageSharp?: {
                gatsbyImageData: any
              }
            }
          }
          fields: {
            slug: string
          }
          excerpt: string
        }
      }>
    }
  }
}

const AtlasPage: React.FC<AtlasPageProps> = ({ data }) => {
  const [visited, setVisited] = React.useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const raw = localStorage.getItem('atlasVisited')
      if (!raw) return new Set()
      return new Set(JSON.parse(raw))
    } catch { return new Set() }
  })

  const recordVisit = React.useCallback((slug: string) => {
    setVisited(prev => {
      const next = new Set(prev)
      next.add(slug)
      try { localStorage.setItem('atlasVisited', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }, [])

  // Transform GraphQL data to AtlasItem format
  const items: AtlasItem[] = data.allMarkdownRemark.edges.map(({ node }) => ({
    slug: node.fields.slug,
    title: node.frontmatter.title || "Untitled",
    subtitle: node.frontmatter.subtitle || node.frontmatter.desc || node.excerpt,
    category: node.frontmatter.category || "Uncategorized",
    subcategory: "General",
    tags: node.frontmatter.tags || [],
    planted_at: node.frontmatter.date || new Date().toISOString(),
  }))

  return (
    <Layout>
      <SEO title="Atlas" />
      <Main>
        <Header>
          <h1>The Atlas</h1>
          <p>A collection of essays, research, and explorations.</p>
        </Header>

        <List>
          {items.map(item => (
            <ItemCard
              key={item.slug}
              item={item}
              onHover={() => {}}
              onClick={() => {
                recordVisit(item.slug)
                navigate(item.slug)
              }}
              visited={visited.has(item.slug)}
            />
          ))}
        </List>
      </Main>
    </Layout>
  )
}

const Main = styled.main`
  min-width: 320px; /* Mobile min-width */
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background: var(--color-background);
  padding: 24px 0 40px;
  
  @media (min-width: 480px) {
    padding: 32px 0 50px;
  }
  
  @media (min-width: 641px) {
    padding: 40px 0 60px;
    min-width: var(--min-width);
  }
`

const Header = styled.div`
  width: 90%;
  max-width: var(--width);
  margin: 0 auto 24px;
  
  h1 {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.1;
    color: var(--color-text);
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: var(--color-text-3);
    max-width: 60ch;
    line-height: 1.4;
  }
  
  @media (min-width: 480px) {
    margin: 0 auto 32px;
    h1 { 
      font-size: 36px; 
      margin-bottom: 10px;
    }
    p { font-size: 16px; }
  }
  
  @media (min-width: 641px) {
    width: 87.5%;
    margin: 0 auto 40px;
    h1 { 
      font-size: 48px;
      line-height: 1.05;
      margin-bottom: 12px;
    }
    p { font-size: 18px; }
  }
`

const List = styled.section`
  width: 90%;
  max-width: var(--width);
  margin: 0 auto;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  
  @media (min-width: 480px) {
    gap: 14px;
  }
  
  @media (min-width: 641px) {
    width: 87.5%;
    gap: 16px;
  }
  
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const query = graphql`
  query AtlasPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/essays/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 150)
          frontmatter {
            title
            subtitle
            desc
            category
            date
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  width: 400
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default AtlasPage