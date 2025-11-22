import React, { useState, useLayoutEffect } from "react"
import type { PageProps } from "gatsby"
import { graphql } from "gatsby"
import styled from "styled-components"

import type Post from "Types/Post"
import useSiteMetadata from "Hooks/useSiteMetadata"
import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PostGrid from "Components/postGrid"
import CategoryFilter from "Components/categoryFilter"
import { useQueryParamString } from "react-use-query-param-string"

const DISPLAY_NAMES_FOR_CATEGORIES: Record<string, string> = {
  all: "All",
  code: "Code",
  instruction: "Instruction",
  markdown: "Markdown",
  something: "Something",
}

const Projects = ({
  pageContext,
  data,
  location,
}: PageProps<Queries.Query, Queries.MarkdownRemarkFrontmatter>) => {
  // Projects page remains as-is; Atlas is available at /atlas
  const [posts, setPosts] = useState<Post[]>([])
  // make currentCategory only a string
  const [currentCategory] = useQueryParamString("category", "")

  const postData = data.allMarkdownRemark.edges
  useLayoutEffect(() => {
    const filteredPostData =
      currentCategory !== ""
        ? postData.filter(({ node }) => {
            return node?.frontmatter?.category === currentCategory
          })
        : postData

    const newPosts = filteredPostData.map(({ node }) => {
      const { id } = node
      const { slug } = node.fields!
      const {
        title,
        desc,
        date,
        category,
        thumbnail,
        alt,
        githubLink,
        paperLink,
        demoLink,
      } = node.frontmatter!
      const { childImageSharp } = thumbnail!

      return {
        id,
        slug,
        title,
        desc,
        date,
        category,
        thumbnail: childImageSharp?.id,
        alt,
        githubLink,
        paperLink,
        demoLink,
      }
    })
    setPosts(newPosts)
  }, [currentCategory, postData])

  const postTitle = DISPLAY_NAMES_FOR_CATEGORIES[currentCategory] || "Projects"
  return (
    <Layout>
      <SEO title="Pages" />
      <Main>
        <Content>
          <CategoryFilter categoryList={data.allMarkdownRemark.group} />
          <PostTitle>{postTitle}</PostTitle>
          <PostGrid posts={posts} />
        </Content>
      </Main>
    </Layout>
  )
}

const Main = styled.main`
  min-width: var(--min-width);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background-color: var(--color-background);
`

const Content = styled.div`
  box-sizing: content-box;
  width: 87.5%;
  max-width: var(--width);
  padding-top: var(--sizing-lg);
  padding-bottom: var(--sizing-lg);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    padding-top: var(--grid-gap-lg);
    width: 87.5%;
  }
`

const PostTitle = styled.h2`
  font-size: 2rem;
  font-weight: var(--font-weight-extra-bold);
  margin-bottom: var(--sizing-md);
  line-height: 1.21875;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    font-size: 1.75rem;
  }
`

export const query = graphql`
  query Projects {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/(posts/projects)/" } }
      limit: 2000
      sort: { frontmatter: { date: DESC } }
    ) {
      group(field: { frontmatter: { category: SELECT } }) {
        fieldValue
        totalCount
      }
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            category
            date
            desc
            thumbnail {
              childImageSharp {
                id
              }
              base
            }
            alt
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default Projects
