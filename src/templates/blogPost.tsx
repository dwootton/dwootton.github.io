import React from "react"
import { graphql, type PageProps } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import { rhythm } from "Styles/typography"
import DateTime from "Styles/dateTime"
import Markdown from "Styles/markdown"
import PageType from "Components/atlas/post/PageType"

const BlogPost: React.FC<PageProps<Queries.Query>> = ({ data }) => {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark!
  const {
    title,
    desc,
    thumbnail,
    date,
    audience,
    category,
    demoLink,
    githubLink,
    paperLink,
    liveLink,
  } = frontmatter!

  const ogImagePath =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    thumbnail &&
    thumbnail?.childImageSharp?.gatsbyImageData!.images!.fallback!.src

  const fm = {
    type: "project",
    title,
    deck: desc,
    topics: [category].filter(Boolean) as string[],
    date,
    audience: audience || undefined,
    status: "charted" as const,
    repo_url: githubLink || undefined,
    live_url: liveLink || undefined,
  }

  return (
    <Layout>
      <SEO title={title} desc={desc} image={ogImagePath} />
      <main>
        <article>
          <PageTypeWrapper>
            <PageType frontmatter={fm as any}>
              {(demoLink || paperLink) && (
                <Materials>
                  {demoLink && <MaterialLink href={demoLink}>Demo</MaterialLink>}
                  {paperLink && <MaterialLink href={paperLink}>Paper</MaterialLink>}
                </Materials>
              )}
              <Divider />
              <Markdown
                dangerouslySetInnerHTML={{ __html: html ?? "" }}
                rhythm={rhythm}
              />
            </PageType>
          </PageTypeWrapper>
        </article>
      </main>
    </Layout>
  )
}

const PageTypeWrapper = styled.div`
  margin-top: var(--sizing-xl);
  /* Allow full width for the grid layout */
  width: 100%;
  padding-bottom: var(--sizing-lg);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    margin-top: var(--sizing-lg);
  }
`

const OuterWrapper = styled.div`
  margin-top: var(--sizing-xl);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    margin-top: var(--sizing-lg);
  }
`

const InnerWrapper = styled.div`
  width: var(--post-width);
  margin: 0 auto;
  padding-bottom: var(--sizing-lg);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: 87.5%;
  }
`

const CommentWrap = styled.section`
  width: 100%;
  padding: 0 var(--padding-sm);
  margin: 0 auto;
  margin-bottom: var(--sizing-xl);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: auto;
  }
`

const Materials = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap; margin: 6px 0 0;
`
const MaterialLink = styled.a`
  justify-self: end;
  font-size: 0.875rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-3);
`
const Info = styled.div``

const Time = styled(DateTime)``

const Desc = styled.p`
  margin-top: var(--sizing-lg);
  line-height: 1.5;
  font-size: var(--text-lg);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    line-height: 1.31579;
    font-size: 1.1875rem;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--color-gray-3);
  margin-top: var(--sizing-lg);
  margin-bottom: var(--sizing-lg);
`

const Title = styled.h1`
  font-weight: var(--font-weight-bold);
  line-height: 1.1875;
  font-size: var(--text-xl);

  @media (max-width: ${({ theme }) => theme.device.md}) {
    line-height: 1.21875;
    font-size: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    line-height: 1.21875;
    font-size: 2rem;
  }
`

export const query = graphql`
  query ProjectsPostPage($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        desc
        thumbnail {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FIXED)
          }
        }
        date(formatString: "YYYY")
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
