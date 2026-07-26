import React from "react"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageIntro from "Components/portfolio/PageIntro"
import ProjectCard from "Components/portfolio/ProjectCard"
import SectionSeparator from "Components/portfolio/SectionSeparator"
import { selectedProjects } from "Components/portfolio/content"

const Projects = () => {
  return (
    <Layout>
      <SEO title="Projects" />
      <PageWrap>
        <PageIntro
          label="WORK"
          title="Work"
          description="A curated set of interface experiments and product-minded research systems focused on exploration, evaluation, and human capability."
          align="wide"
        />

        <SectionSeparator
          title="Project Archive"
        />

        <ArchiveGrid>
          {selectedProjects.map(project => (
            <AnchorSlot key={project.id} id={project.id}>
              <ProjectCard project={project} />
            </AnchorSlot>
          ))}
        </ArchiveGrid>
      </PageWrap>
    </Layout>
  )
}

const PageWrap = styled.div`
  width: var(--site-content-width);
  margin: 0 auto;
  padding: 56px 0 72px;
  display: grid;
  gap: 30px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: var(--site-content-width);
    padding: 42px 0 56px;
  }
`

const ArchiveGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-template-columns: 1fr;
  }
`

const AnchorSlot = styled.div`
  scroll-margin-top: 110px;
`

export default Projects
