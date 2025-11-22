const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  
  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    const absolutePath = (fileNode && fileNode.absolutePath) || ''
    
    // For content/essays/<folder>/file.md structure
    const essayMatch = absolutePath.match(/content\/essays\/([^\/]+)\/[^\/]+\.md$/)
    if (essayMatch) {
      const folderName = essayMatch[1]
      const slug = `/essays/${folderName}/`
      createNodeField({ node, name: `slug`, value: slug })
    } 
    // For content/<category>/*.md files (like pages)
    else if (absolutePath.includes('/content/')) {
      const contentMatch = absolutePath.match(/content\/([^\/]+)\/(.+)\.md$/)
      if (contentMatch) {
        const category = contentMatch[1]
        const filename = contentMatch[2]
        const slug = `/${category}/${filename}/`
        createNodeField({ node, name: `slug`, value: slug })
      }
    } else {
      // Fallback for other markdown files
      const slug = createFilePath({ node, getNode })
      createNodeField({ node, name: `slug`, value: slug })
    }
  }
  
  if (node.internal.type === `Mdx`) {
    // For content/<category>/<slug>/(post|index).mdx files
    const fileNode = getNode(node.parent)
    const absolutePath = (fileNode && fileNode.absolutePath) || ''
    const m = absolutePath.match(/content\/(.+?)\/(post|index)\.(md|mdx)$/)
    if (m && m[1]) {
      const pathParts = m[1].split('/')
      if (pathParts.length >= 2) {
        const category = pathParts[0]
        const slug = pathParts[pathParts.length - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')
        createNodeField({ node, name: 'slug', value: `/${category}/${slug}/` })
      }
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const mainTemplate = path.resolve(`./src/pages/index.tsx`)
  const blogPostTemplate = path.resolve(`./src/templates/blogPost.tsx`)

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/essays/" } }
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

  // Create individual project pages
  const posts = result.data.postsRemark.edges
  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: node.fields.slug,
      },
    })
  })

  // Create category pages
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