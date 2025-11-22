import React from "react"
import styled from "styled-components"
import { graphql, type PageProps } from "gatsby"
// MDX types may not export Renderer typings; cast to any to satisfy TS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MDXRenderer: GatsbyMDXRenderer } = require("gatsby-plugin-mdx")
const MDXRendererAny: React.FC<{ children: string }> = (GatsbyMDXRenderer as any)
import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageType from "Components/atlas/post/PageType"
import type { AtlasItem } from "Components/atlas/types"

const useSlug = (): string | null => {
  if (typeof window === 'undefined') return null
  // Expect pathname like /atlas/<slug>
  const parts = window.location.pathname.split('/').filter(Boolean)
  const idx = parts.indexOf('atlas')
  if (idx >= 0 && parts[idx + 1]) return decodeURIComponent(parts[idx + 1])
  return null
}

const AtlasItemPage: React.FC<PageProps<any>> = ({ data }) => {
  const slug = useSlug()
  

  const mdNodes = data.allMarkdownRemark.edges.map((e: any) => ({
    kind: 'md',
    id: e.node.id,
    html: e.node.html,
    frontmatter: e.node.frontmatter,
    slug: e.node.fields.slug,
  }))
  const mdxNodes = data.allMdx.edges
    .filter((e: any) => e.node.fields?.slug?.startsWith('/atlas/'))
    .map((e: any) => ({
      kind: 'mdx',
      id: e.node.id,
      body: e.node.internal?.content,
      frontmatter: e.node.frontmatter,
      slug: e.node.fields.slug,
    }))
  const nodes = [...mdNodes, ...mdxNodes]
  const match = React.useMemo(() => {
    if (!slug) return null
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const decamel = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    // 1) match by title normalized
    let n = nodes.find((n: any) => n.frontmatter?.title && norm(n.frontmatter.title) === slug)
    if (n) return n
    // 2) match by fields.slug includes slug (tolerate camelCase vs kebab-case)
    n = nodes.find((n: any) => {
      const f = (n.fields?.slug || '').toLowerCase()
      return f.includes(slug) || f.includes(decamel(slug))
    })
    return n || null
  }, [nodes, slug])

  if (!match) {
    return (
      <Layout>
        <SEO title="Atlas Item" />
        <Main><Empty>Item not found.</Empty></Main>
      </Layout>
    )
  }

  const fm = match.frontmatter || {}
  const title = fm.title || 'Atlas Item'
  const pageFm = {
    type: mapCategoryToType(fm.category),
    title: fm.title || '',
    deck: fm.desc || '',
    topics: [],
    date: fm.date || undefined,
    status: 'charted',
    tags: [],
    repo_url: fm.githubLink || undefined,
    live_url: (fm as any).liveLink || undefined,
  } as any

  return (
    <Layout>
      <SEO title={title} />
      <Main>
        <PageType frontmatter={pageFm}>
          {match.kind === 'mdx' ? (
            <MDXRendererAny>{match.body}</MDXRendererAny>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: match.html || '' }} />
          )}
        </PageType>
      </Main>
    </Layout>
  )
}

// Note: previously had per-type rendering helpers; consolidate into PageType usage

const Main = styled.main`
  min-width: var(--min-width);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background: var(--color-background);
  padding: 16px 0 40px;
`

const Article = styled.article`
  width: 87.5%; max-width: var(--post-width); margin: 0 auto; display: grid; gap: 12px;
  background: var(--color-post-background);
`

const Empty = styled.div`
  width: 87.5%; max-width: var(--post-width); margin: 0 auto; color: var(--charcoal);
`

function mapCategoryToType(cat?: string | null): any {
  const c = (cat || '').toLowerCase()
  if (c.includes('guide')) return 'guidepost'
  if (c.includes('note')) return 'field_note'
  if (c.includes('essay') || c.includes('paper')) return 'essay'
  return 'project'
}

export default AtlasItemPage
export const pageQuery = graphql`
  query AtlasItemsQueryPage {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/(posts)/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges { node { id html frontmatter { title desc date category demoLink githubLink paperLink liveLink } fields { slug } } }
    }
    allMdx {
      edges { node { id internal { content } } }
    }
  }
`
