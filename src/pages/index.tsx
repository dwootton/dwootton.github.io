import React from "react"
import { Link, type PageProps } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import { navigateWithAtlasTransition } from "Components/atlas/AtlasTransitionLayer"
import CoordinateLabel from "Components/portfolio/CoordinateLabel"
import ProjectCard from "Components/portfolio/ProjectCard"
import SectionSeparator from "Components/portfolio/SectionSeparator"
import {
  baseCoordinate,
  selectedProjects,
} from "Components/portfolio/content"

const Home: React.FC<PageProps> = ({ location }) => {
  const showCoordinate = location.pathname === "/"

  const openAtlas = React.useCallback(() => {
    navigateWithAtlasTransition("/atlas/")
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <Page>
        <HeroSection>
          <HeroAtlasStage onClick={openAtlas} />

          <HeroCopy data-atlas-home-chrome="true">
            {showCoordinate ? (
              <CoordinateRow>
                <CoordinateLabel coordinate={baseCoordinate} />
              </CoordinateRow>
            ) : null}
            <HeroTitle>
              Dylan builds <MobileBreak />
              interactive systems <LineBreak />
              that make information <LineBreak />
              <AccentWord>explorable.</AccentWord>
            </HeroTitle>
            <HeroBody>
              Design Engineer and HCI Researcher working on human-AI
              interaction to expand human capability.
            </HeroBody>
            <HeroActions>
              <HeroLink to="/about/">About me</HeroLink>
              <HeroSecondaryLink to="/research/">Research</HeroSecondaryLink>
            </HeroActions>
          </HeroCopy>

          <HeroAtlasSlot data-atlas-home-anchor="true" aria-hidden="true" />

          <AtlasPrompt
            type="button"
            data-atlas-home-chrome="true"
            onClick={event => {
              event.stopPropagation()
              openAtlas()
            }}
          >
            Open Atlas
          </AtlasPrompt>
        </HeroSection>

        <SectionSeparator title="Selected Work" href="/projects/" />

        <SelectedWorkSection id="selected-work">
          <WorkGrid>
            {selectedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </WorkGrid>
        </SelectedWorkSection>
      </Page>
    </Layout>
  )
}

const Page = styled.div`
  width: var(--site-content-width);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: calc(100% - 30px);
  }
`

const HeroSection = styled.section`
  position: relative;
  min-height: clamp(410px, 44vw, 560px);
  padding: 58px 0 50px;
  display: grid;
  align-items: center;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    min-height: 520px;
    align-items: start;
    padding: 46px 0 30px;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    min-height: 0;
    padding: 36px 0 30px;
  }
`

const HeroCopy = styled.div`
  max-width: 840px;
  position: relative;
  z-index: 2;
  opacity: var(--atlas-hero-progress, 1);
  transform: translate3d(0, var(--atlas-hero-offset, 0px), 0);
  transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
`

const HeroAtlasStage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
`

const HeroAtlasSlot = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: block;
    position: relative;
    width: 100%;
    height: 182px;
    margin-top: 26px;
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.device.xs}) {
    height: 150px;
    margin-top: 22px;
  }
`

const atlasControlStyles = `
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 8px 10px;
  border: 1px solid var(--card-border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--color-text);
  box-shadow: 0 6px 18px rgba(50, 42, 32, 0.08);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
`

const AtlasPrompt = styled.button`
  ${atlasControlStyles}
  position: absolute;
  right: 18px;
  bottom: 42px;
  z-index: 3;
  cursor: pointer;
  opacity: var(--atlas-hero-progress, 1);
  transform: translate3d(0, var(--atlas-hero-offset, 0px), 0);
  transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: var(--color-floating-button-border-hover);
    color: var(--accent);
  }

  @media (max-width: ${({ theme }) => theme.device.md}) {
    bottom: 34px;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    position: relative;
    right: auto;
    bottom: auto;
    justify-self: end;
    margin-top: 10px;
  }
`

const CoordinateRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-text-3);
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  max-width: 840px;
  font-size: 3.55rem;
  line-height: 0.97;
  letter-spacing: 0;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    font-size: 3.3rem;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    font-size: 2.28rem;
    line-height: 1.02;
  }

  @media (max-width: ${({ theme }) => theme.device.xs}) {
    font-size: 2.18rem;
  }
`

const LineBreak = styled.br`
`

const MobileBreak = styled.br`
  display: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: block;
  }
`

const AccentWord = styled.span`
  color: var(--green);
  font-style: italic;
  font-weight: 500;
`

const HeroBody = styled.p`
  margin-top: 16px;
  max-width: 540px;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--color-text-2);
`

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  margin-top: 16px;
`

const HeroLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  color: var(--accent);

  &:hover {
    text-decoration: underline;
  }
`

const HeroSecondaryLink = styled(HeroLink)`
  color: var(--color-text-2);
`

const SelectedWorkSection = styled.section`
  position: relative;
  display: grid;
  padding: 22px 0 24px;
`

const WorkGrid = styled.div`
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

export default Home
