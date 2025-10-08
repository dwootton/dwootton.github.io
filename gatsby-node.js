const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `posts` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
  if (node.internal.type === `Mdx`) {
    // For atlas-posts/<slug>/post.mdx → slug: /atlas/<slug>
    const fileNode = getNode(node.parent)
    const absolutePath = (fileNode && fileNode.absolutePath) || ''
    const m = absolutePath.match(/atlas-posts\/(.+?)\/(post|index)\.(md|mdx)$/)
    if (m && m[1]) {
      const atlasSlug = `/atlas/${m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
      createNodeField({ node, name: 'slug', value: atlasSlug })
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const mainTemplate = path.resolve(`./src/pages/index.tsx`)
  const blogPostTemplate = path.resolve(`./src/templates/blogPost.tsx`)

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/(posts/projects)/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 2000
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      categoriesGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { category: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const posts = result.data.postsRemark.edges

  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: node.fields.slug,
      },
    })

    // Deprecate legacy project paths under /project/ and /projects/ to /atlas/<slug>
    // The new atlas path will try to match by normalized title or slug part
    const slug = String(node.fields.slug || '')
    // Expect format like /posts/projects/<name>/ -> derive last segment
    const lastSeg = slug.split('/').filter(Boolean).pop() || ''
    const atlasTarget = `/atlas/${encodeURIComponent(lastSeg)}`
    const legacyPaths = [
      `/project/${lastSeg}/`,
      `/projects/${lastSeg}/`,
    ]
    legacyPaths.forEach(fromPath => {
      createRedirect({ fromPath, toPath: atlasTarget, isPermanent: true, redirectInBrowser: true })
    })
  })

  const categories = result.data.categoriesGroup.group

  categories.forEach(category => {
    createPage({
      path: `/category/${_.kebabCase(category.fieldValue)}/`,
      component: mainTemplate,
      context: {
        category: category.fieldValue,
      },
    })
  })

  // Nothing else here; /atlas client-only subroutes handled in onCreatePage
}

// Add client-only matches for /atlas/* pages so client routes render
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions
  if (page.path === '/atlas-item/') {
    const oldPage = { ...page }
    page.matchPath = '/atlas/*'
    deletePage(oldPage)
    createPage(page)
  }
}
