import React from "react"
import { graphql, type PageProps } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import CurrentHeadingMarker from "Components/portfolio/CurrentHeadingMarker"
import PageIntro from "Components/portfolio/PageIntro"
import Markdown from "Styles/markdown"
import { rhythm } from "Styles/typography"

const BlogPost: React.FC<PageProps<Queries.Query>> = ({ data }) => {
  const articleRef = React.useRef<HTMLElement>(null)
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark!
  const {
    title,
    desc,
    thumbnail,
    date,
    category,
    demoLink,
    githubLink,
    paperLink,
    liveLink,
    tags,
  } = frontmatter!

  const ogImagePath =
    thumbnail &&
    thumbnail?.childImageSharp?.gatsbyImageData!.images!.fallback!.src

  return (
    <Layout>
      <SEO title={title} desc={desc} image={ogImagePath} />
      <PageWrap>
        <PageIntro
          label={(category || "Essay").toUpperCase()}
          title={title || "Untitled"}
          description={desc || ""}
          align="wide"
          backHref="/atlas/"
          backLabel="Back to Writing Atlas"
        />

        <ContentGrid>
          <ArticleCard ref={articleRef}>
            <CurrentHeadingMarker
              containerRef={articleRef}
              headingSelector="h2, h3"
              markerSize={10}
              offsetX={18}
            />
            <Markdown
              dangerouslySetInnerHTML={{ __html: html ?? "" }}
              rhythm={rhythm}
            />
          </ArticleCard>
          <Rail>
            <RailCard>
              <RailLabel>DATE</RailLabel>
              <RailText>{date || "In progress"}</RailText>
            </RailCard>
            {(demoLink || paperLink || githubLink || liveLink) ? (
              <RailCard>
                <RailLabel>LINKS</RailLabel>
                <LinkList>
                  {liveLink ? <a href={liveLink}>Live project</a> : null}
                  {demoLink ? <a href={demoLink}>Demo</a> : null}
                  {paperLink ? <a href={paperLink}>Paper</a> : null}
                  {githubLink ? <a href={githubLink}>Source</a> : null}
                </LinkList>
              </RailCard>
            ) : null}
            {tags && tags.length > 0 ? (
              <RailCard>
                <RailLabel>TOPICS</RailLabel>
                <TagList>
                  {tags.map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </TagList>
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

export const query = graphql`
  query ProjectsPostPage($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        desc
        tags
        thumbnail {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FIXED)
          }
        }
        date(formatString: "MMM D, YYYY")
        category
        demoLink
        paperLink
        githubLink
        liveLink
      }
    }
  }
`

export default BlogPost
