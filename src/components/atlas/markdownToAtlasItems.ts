import type { AtlasItem } from "./types"
import { selectedProjects } from "../portfolio/content"

export interface AtlasMarkdownEdge {
  node: {
    id: string
    frontmatter: {
      title?: string
      subtitle?: string
      desc?: string
      category?: string
      subcategory?: string
      date?: string
      tags?: string[]
      thumbnail?: {
        childImageSharp?: {
          gatsbyImageData?: {
            images?: {
              fallback?: {
                src?: string
              }
            }
          }
        }
      }
    }
    fields: {
      slug: string
    }
    excerpt: string
  }
}

export const atlasPoints = [
  { x: -0.74, y: 0.58 },
  { x: -0.38, y: 0.22 },
  { x: -0.05, y: -0.12 },
  { x: 0.36, y: -0.38 },
  { x: 0.72, y: -0.62 },
  { x: -0.58, y: -0.42 },
  { x: 0.16, y: 0.46 },
]

const pointForIndex = (index: number) => {
  const fixedPoint = atlasPoints[index]
  if (fixedPoint) return fixedPoint

  const spiralIndex = index - atlasPoints.length
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const radius = 0.28 + (spiralIndex % 10) * 0.055
  const angle = spiralIndex * goldenAngle

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export const markdownEdgesToAtlasItems = (
  edges: AtlasMarkdownEdge[]
): AtlasItem[] =>
  edges.map(({ node }, index) => {
    const point = pointForIndex(index)

    return {
      slug: node.fields.slug,
      title: node.frontmatter.title || "Untitled",
      desc: node.frontmatter.subtitle || node.frontmatter.desc || node.excerpt,
      category: node.frontmatter.category || "Uncategorized",
      subcategory: node.frontmatter.subcategory || "General",
      tags: node.frontmatter.tags || [],
      topics: node.frontmatter.tags || [],
      date: node.frontmatter.date || new Date().toISOString(),
      planted_at: node.frontmatter.date || new Date().toISOString(),
      type: "project" as const,
      status: "charted" as const,
      x: point.x,
      y: point.y,
      cluster: index % 3,
      thumbnail:
        node.frontmatter.thumbnail?.childImageSharp?.gatsbyImageData?.images
          ?.fallback?.src,
    }
  })

export const homepageContentToAtlasItems = (offset = 0): AtlasItem[] => {
  const projectItems = selectedProjects.map((project, index) => {
    const point = pointForIndex(offset + index)

    return {
      slug: project.href,
      title: project.title,
      desc: project.description,
      category: "Selected Work",
      subcategory: project.kicker,
      tags: project.tags,
      topics: project.tags,
      date: "2026-01-01",
      planted_at: "2026-01-01",
      type: "project" as const,
      status: "charted" as const,
      x: point.x,
      y: point.y,
      cluster: 3,
    }
  })

  return projectItems
}

export const markdownEdgesToExpandedAtlasItems = (
  edges: AtlasMarkdownEdge[]
): AtlasItem[] => {
  const markdownItems = markdownEdgesToAtlasItems(edges)
  return [
    ...markdownItems,
    ...homepageContentToAtlasItems(markdownItems.length),
  ]
}
