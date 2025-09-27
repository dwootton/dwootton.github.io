export type AtlasPostType =
  | 'essay'
  | 'field_note'
  | 'guidepost'
  | 'project'
  | 'talk'
  | 'podcast'
  | 'log'
  | 'fragment'
  | 'map'

export type StatusStage = 'uncharted' | 'in_progress' | 'charted' | 'archived'

export interface Frontmatter {
  type: AtlasPostType
  title: string
  deck?: string
  topics?: string[]
  date?: string // planted
  updated?: string // last tended
  status?: StatusStage
  elevation?: number // 1..5
  tags?: string[]
  audience?: string
  readTime?: string
  effort?: string
  repo_url?: string
  live_url?: string
  event?: string
  series?: string
}

export interface MapKeyFields {
  audience?: string
  readTime?: string
  effort?: string
  links?: { label: string; href: string }[]
  coordinates?: string
  extra?: Array<{ label: string; value: string }>
}

export interface PageTypeProps {
  frontmatter: Frontmatter
  children?: React.ReactNode
  related?: Array<{ title: string; slug: string }>
  prev?: { title: string; slug: string } | null
  next?: { title: string; slug: string } | null
  mapKey?: MapKeyFields
}

