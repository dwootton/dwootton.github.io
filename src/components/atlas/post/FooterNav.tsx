import React from 'react'
import styled from 'styled-components'

interface Link { title: string; slug: string }
interface Props {
  tags?: string[]
  related?: Link[]
  prev?: Link | null
  next?: Link | null
}

const FooterNav: React.FC<Props> = ({ tags = [], related = [], prev, next }) => {
  return (
    <Footer>
      {tags.length > 0 && (
        <Section>
          <Label>Tags</Label>
          <TagList>
            {tags.map(t => <span key={t}>#{t}</span>)}
          </TagList>
        </Section>
      )}
      {related.length > 0 && (
        <Section>
          <Label>Related</Label>
          <RelatedList>
            {related.map(r => (
              <a key={r.slug} href={r.slug}>{r.title}</a>
            ))}
          </RelatedList>
        </Section>
      )}
      {(prev || next) && (
        <PN>
          {prev && <a href={prev.slug} className="prev">← {prev.title}</a>}
          {next && <a href={next.slug} className="next">{next.title} →</a>}
        </PN>
      )}
    </Footer>
  )
}

const Footer = styled.footer`
  margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--color-divider);
  display: grid; gap: 16px;
`
const Section = styled.div``
const Label = styled.div`
  font-family: var(--font-mono); font-size: 12px; color: var(--color-text-3); margin-bottom: 6px;
`
const TagList = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px;
  span{ border: 1px solid var(--color-divider); border-radius: 999px; padding: 2px 8px; font-size: 12px; }
`
const RelatedList = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px;
  a { color: var(--accent); text-decoration: underline; font-size: 14px; }
`
const PN = styled.nav`
  display: flex; justify-content: space-between; margin-top: 8px;
  a { color: var(--color-text-2); }
`

export default FooterNav

