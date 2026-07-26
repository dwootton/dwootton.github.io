import React from "react"
import styled from "styled-components"
import { graphql, type PageProps } from "gatsby"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import CurrentHeadingMarker from "Components/portfolio/CurrentHeadingMarker"
import PageIntro from "Components/portfolio/PageIntro"
import Markdown from "Styles/markdown"
import { rhythm } from "Styles/typography"

const useSlug = (): string | null => {
  if (typeof window === "undefined") return null
  const parts = window.location.pathname.split("/").filter(Boolean)
  const idx = parts.indexOf("atlas")
  if (idx >= 0 && parts[idx + 1]) return decodeURIComponent(parts[idx + 1])
  return null
}

const AtlasItemPage: React.FC<PageProps<any>> = ({ data }) => {
  const articleRef = React.useRef<HTMLElement>(null)
  const slug = useSlug()

  const mdNodes = data.allMarkdownRemark.edges.map((e: any) => ({
    id: e.node.id,
    html: e.node.html,
    frontmatter: e.node.frontmatter,
    slug: e.node.fields.slug,
  }))
  const nodes = mdNodes

  const match = React.useMemo(() => {
    if (!slug) return null
    const norm = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const decamel = (s: string) =>
      s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    let n = nodes.find((node: any) => node.frontmatter?.title && norm(node.frontmatter.title) === slug)
    if (n) return n
    n = nodes.find((node: any) => {
      const fieldSlug = (node.slug || "").toLowerCase()
      return fieldSlug.includes(slug) || fieldSlug.includes(decamel(slug))
    })
    return n || null
  }, [nodes, slug])

  if (!match) {
    return (
      <Layout>
        <SEO title="Atlas item" />
        <PageWrap>
          <PageIntro
            label="ATLAS"
            title="Item not found."
            description="The requested atlas entry is not available in the current collection."
          />
        </PageWrap>
      </Layout>
    )
  }

  const fm = match.frontmatter || {}
  const title = fm.title || "Atlas Item"

  return (
    <Layout>
      <SEO title={title} />
      <PageWrap>
        <PageIntro
          label={String(fm.category || "Atlas").toUpperCase()}
          title={title}
          description={fm.desc || fm.subtitle || ""}
          align="wide"
        />

        <ContentGrid>
          <ArticleCard ref={articleRef}>
            <CurrentHeadingMarker
              containerRef={articleRef}
              headingSelector="h2, h3"
              markerSize={10}
              offsetX={18}
            />
            <Markdown rhythm={rhythm} dangerouslySetInnerHTML={{ __html: match.html || "" }} />
          </ArticleCard>
          <Rail>
            {fm.date ? (
              <RailCard>
                <RailLabel>DATE</RailLabel>
                <RailText>{fm.date}</RailText>
              </RailCard>
            ) : null}
            {fm.tags && fm.tags.length > 0 ? (
              <RailCard>
                <RailLabel>TOPICS</RailLabel>
                <TagList>
                  {fm.tags.map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </TagList>
              </RailCard>
            ) : null}
            {(fm.githubLink || fm.paperLink || fm.demoLink || fm.liveLink) ? (
              <RailCard>
                <RailLabel>LINKS</RailLabel>
                <LinkList>
                  {fm.liveLink ? <a href={fm.liveLink}>Live project</a> : null}
                  {fm.demoLink ? <a href={fm.demoLink}>Demo</a> : null}
                  {fm.paperLink ? <a href={fm.paperLink}>Paper</a> : null}
                  {fm.githubLink ? <a href={fm.githubLink}>Source</a> : null}
                </LinkList>
              </RailCard>
            ) : null}
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
  gap: 34px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: var(--site-content-width);
    padding: 42px 0 56px;
  }
`

const ContentGrid = styled.section`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const ArticleCard = styled.article`
  position: relative;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  padding: 30px clamp(20px, 3vw, 38px);
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--color-card);
  box-shadow:
    0 1px 2px var(--shadow),
    0 8px 24px var(--shadow);
`

const Rail = styled.aside`
  min-width: 0;
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

const RailText = styled.p`
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--color-text-2);
`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    border: 1px solid var(--color-divider);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.76rem;
    color: var(--color-text-2);
  }
`

const LinkList = styled.div`
  display: grid;
  gap: 10px;

  a {
    width: fit-content;
    color: var(--accent);
  }

  a:hover {
    text-decoration: underline;
  }
`

export default AtlasItemPage

export const pageQuery = graphql`
  query AtlasItemsQueryPage {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/(content/essays|posts)/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges { node { id html frontmatter { title desc subtitle date category tags demoLink githubLink paperLink liveLink } fields { slug } } }
    }
  }
`
