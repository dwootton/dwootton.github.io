import React from "react"

import SketchCard from "./SketchCard"
import type { PortfolioProject } from "./content"
import type { SketchCardVariant } from "./sketchTypes"

interface ProjectCardProps {
  project: PortfolioProject
  variant?: SketchCardVariant
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, variant = "plate" }) => (
  <SketchCard project={project} seed={project.id} variant={variant} />
)

export default ProjectCard
