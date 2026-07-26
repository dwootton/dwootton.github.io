import React from "react"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import PageIntro from "Components/portfolio/PageIntro"
import {
  contactHref,
  researchOutputs,
  researchPublications,
} from "Components/portfolio/content"

const ResearchPage: React.FC = () => {
  const publications = researchPublications.filter(
    publication => publication.id !== "arctic-explorer"
  )
  const posters = researchPublications.filter(
    publication => publication.id === "arctic-explorer"
  )

  return (
    <Layout>
      <SEO title="Research" />
      <PageWrap>
        <PageIntro
          label="RESEARCH"
          title="Research"
          description="A CV-style view of publications, systems, and current research threads for HCI and visualization readers."
          align="wide"
        />

        <ContentGrid>
          <MainColumn>
            <Section aria-labelledby="papers-heading">
              <SectionHeading id="papers-heading">
                Selected Papers
              </SectionHeading>
              <PublicationList>
                {publications.map(publication => (
                  <PublicationItem key={publication.id}>
                    <PublicationYear>{publication.year}</PublicationYear>
                    <PublicationBody>
                      <PublicationType>{publication.type}</PublicationType>
                      <PublicationTitle>{publication.title}</PublicationTitle>
                      <PublicationAuthors>
                        {publication.authors}
                      </PublicationAuthors>
                      <PublicationVenue>{publication.venue}</PublicationVenue>
                      <PublicationSummary>
                        {publication.summary}
                      </PublicationSummary>
                      <PublicationLinks>
                        {publication.links.map(link => (
                          <a key={link.href} href={link.href}>
                            {link.label}
                          </a>
                        ))}
                      </PublicationLinks>
                    </PublicationBody>
                  </PublicationItem>
                ))}
              </PublicationList>
            </Section>

            <Section aria-labelledby="systems-heading">
              <SectionHeading id="systems-heading">
                Systems and IP
              </SectionHeading>
              <OutputGrid>
                {researchOutputs.map(output => (
                  <OutputItem key={output.id}>
                    <OutputMeta>
                      <span>{output.label}</span>
                      <span>{output.status}</span>
                    </OutputMeta>
                    <OutputTitle>{output.title}</OutputTitle>
                    <OutputDescription>{output.description}</OutputDescription>
                  </OutputItem>
                ))}
              </OutputGrid>
            </Section>

            <Section aria-labelledby="posters-heading">
              <SectionHeading id="posters-heading">
                Posters and Earlier Work
              </SectionHeading>
              <PublicationList>
                {posters.map(publication => (
                  <PublicationItem key={publication.id}>
                    <PublicationYear>{publication.year}</PublicationYear>
                    <PublicationBody>
                      <PublicationType>{publication.type}</PublicationType>
                      <PublicationTitle>{publication.title}</PublicationTitle>
                      <PublicationAuthors>
                        {publication.authors}
                      </PublicationAuthors>
                      <PublicationVenue>{publication.venue}</PublicationVenue>
                      <PublicationSummary>
                        {publication.summary}
                      </PublicationSummary>
                      <PublicationLinks>
                        {publication.links.map(link => (
                          <a key={link.href} href={link.href}>
                            {link.label}
                          </a>
                        ))}
                      </PublicationLinks>
                    </PublicationBody>
                  </PublicationItem>
                ))}
              </PublicationList>
            </Section>
          </MainColumn>

          <ResearchRail>
            <RailBlock>
              <RailLabel>Affiliation</RailLabel>
              <RailText>
                PhD student, MIT CSAIL Visualization Group. Advised by Arvind
                Satyanarayan.
              </RailText>
            </RailBlock>
            <RailBlock>
              <RailLabel>Focus</RailLabel>
              <RailList>
                <li>Exploratory data analysis</li>
                <li>Interaction traces and grammars</li>
                <li>Human-centered AI systems</li>
                <li>Visualization and HCI methods</li>
              </RailList>
            </RailBlock>
            <RailBlock>
              <RailLabel>Contact</RailLabel>
              <RailLink href={contactHref}>dwootton@mit.edu</RailLink>
            </RailBlock>
          </ResearchRail>
        </ContentGrid>
      </PageWrap>
    </Layout>
  )
}

const PageWrap = styled.div`
  width: var(--site-content-width);
  margin: 0 auto;
  padding: 56px 0 72px;
  display: grid;
  gap: 34px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: var(--site-content-width);
    padding: 42px 0 56px;
  }
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 48px;

  @media (max-width: ${({ theme }) => theme.device.md}) {
    grid-template-columns: 1fr;
  }
`

const MainColumn = styled.div`
  min-width: 0;
  display: grid;
  gap: 42px;
`

const Section = styled.section`
  min-width: 0;
  display: grid;
  gap: 18px;
`

const SectionHeading = styled.h2`
  padding-bottom: 10px;
  border-bottom: 1px solid var(--decor-guide-strong);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  color: var(--color-text);
  text-transform: uppercase;
`

const PublicationList = styled.div`
  display: grid;
  gap: 0;
`

const PublicationItem = styled.article`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 22px;
  padding: 22px 0;
  border-bottom: 1px solid var(--decor-guide);

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

const PublicationYear = styled.span`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-3);
`

const PublicationBody = styled.div`
  min-width: 0;
  display: grid;
  gap: 8px;
`

const PublicationType = styled.span`
  width: fit-content;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  color: var(--color-text-3);
  text-transform: uppercase;
`

const PublicationTitle = styled.h3`
  max-width: 58rem;
  font-size: 1.6rem;
  line-height: 1.12;
  letter-spacing: 0;
  color: var(--color-text);
  font-family: var(--font-serif);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    font-size: 1.35rem;
  }
`

const PublicationAuthors = styled.p`
  max-width: 58rem;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--color-text-2);
`

const PublicationVenue = styled.p`
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0;
  color: var(--color-text-3);
`

const PublicationSummary = styled.p`
  max-width: 48rem;
  font-size: 0.94rem;
  line-height: 1.58;
  color: var(--color-text-2);
`

const PublicationLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  font-size: 0.9rem;

  a {
    color: var(--accent);
  }

  a:hover {
    text-decoration: underline;
  }
`

const OutputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 28px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-template-columns: 1fr;
  }
`

const OutputItem = styled.article`
  min-width: 0;
  display: grid;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--decor-guide);
`

const OutputMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  color: var(--color-text-3);
  text-transform: uppercase;
`

const OutputTitle = styled.h3`
  font-size: 1.3rem;
  line-height: 1.14;
  color: var(--color-text);
  font-family: var(--font-serif);
`

const OutputDescription = styled.p`
  font-size: 0.92rem;
  line-height: 1.58;
  color: var(--color-text-2);
`

const ResearchRail = styled.aside`
  display: grid;
  align-content: start;
  gap: 18px;
`

const RailBlock = styled.section`
  display: grid;
  gap: 10px;
  padding: 16px 0 18px;
  border-top: 1px solid var(--decor-guide-strong);
`

const RailLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  color: var(--color-text-3);
  text-transform: uppercase;
`

const RailText = styled.p`
  font-size: 0.92rem;
  line-height: 1.58;
  color: var(--color-text-2);
`

const RailList = styled.ul`
  display: grid;
  gap: 10px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--color-text-2);

  li {
    list-style: none;
  }
`

const RailLink = styled.a`
  font-size: 0.94rem;
  color: var(--accent);

  &:hover {
    text-decoration: underline;
  }
`

export default ResearchPage
