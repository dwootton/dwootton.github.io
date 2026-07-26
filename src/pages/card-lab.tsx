import React from "react"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageIntro from "Components/portfolio/PageIntro"
import SketchCard from "Components/portfolio/SketchCard"
import { cardLabProjects } from "Components/portfolio/content"
const CardLab = () => {
  return (
    <Layout>
      <SEO title="Card Lab" />
      <PageWrap>
        <PageIntro
          label="CARD LAB"
          title="Editorial project card system."
          description="A full-bleed preview and content-pane treatment for the portfolio project cards."
          align="wide"
        />

        <LabNote>
          <strong>Structure:</strong> each card uses full-bleed media, a clear editorial
          content pane, thin borders, and data-driven metadata.
        </LabNote>

        <Gallery aria-label="Generated sketch card variants">
          {cardLabProjects.map(project => (
            <SketchCard
              key={project.id}
              project={project}
            />
          ))}
        </Gallery>
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

const LabNote = styled.p`
  max-width: 56rem;
  padding: 16px 20px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  color: var(--color-text-2);
  font-size: 0.95rem;
  line-height: 1.58;

  strong {
    color: var(--color-text);
    font-weight: 600;
  }
`

const Gallery = styled.section`
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

export default CardLab
