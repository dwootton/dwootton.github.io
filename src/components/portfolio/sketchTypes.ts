export type SketchThumbnailType =
  | "model-compass"
  | "pathfinder"
  | "systems-sandbox"
  | "network"
  | "dashboard"
  | "map"
  | "timeline"
  | "blank"

export type SketchAccent = "green" | "copper" | "blue" | "slate"

export type SketchCardVariant = "plate" | "quiet" | "field-note" | "draft" | "specimen"

export interface ProjectCardData {
  id: string
  title: string
  kicker: string
  description: string
  tags: string[]
  href?: string
  thumbnailType?: SketchThumbnailType
  accent?: SketchAccent
}
