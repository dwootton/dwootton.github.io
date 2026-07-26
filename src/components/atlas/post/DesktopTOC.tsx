import React from 'react'
import styled from 'styled-components'

export interface DesktopTocItem { id: string; label: string; level?: 2 | 3 }

interface DesktopTOCProps {
  items: DesktopTocItem[]
  accentColor?: string
  collapsedByDefault?: boolean
  activeId?: string
  onToggle?(isCollapsed: boolean): void
  className?: string
  collapsed?: boolean
}

const DesktopTOC: React.FC<DesktopTOCProps> = ({
  items,
  accentColor = 'var(--accent)',
  collapsedByDefault = false,
  activeId,
  onToggle,
  className,
  collapsed: collapsedProp,
}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(!!collapsedByDefault)

  // Allow controlled collapse via prop
  React.useEffect(() => {
    if (typeof collapsedProp === 'boolean') setCollapsed(collapsedProp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedProp])

  const toggle = React.useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      try { onToggle && onToggle(next) } catch (_) { return next }
      return next
    })
  }, [onToggle])

  if (!items || items.length === 0) return null

  return (
    <Aside role="complementary" aria-label="Table of contents">
      <Container className={`desktop-toc-container desktop-container${collapsed ? ' collapsed' : ''} ${className || ''}`.trim()}>
        <Title
          id="desktop-toc-header"
          role="button"
          tabIndex={0}
          aria-controls="desktop-toc-content"
          aria-expanded={!collapsed}
          onClick={toggle}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() } }}
        >
          <Dot aria-hidden="true" viewBox="0 0 8 8">
            <rect x="0" y="0" width="8" height="8" fill={accentColor} />
          </Dot>
          <h4>Table of Contents</h4>
          <Chevron className="arrow-icon" viewBox="0 0 24 24" data-collapsed={collapsed ? 'true' : 'false'}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </Chevron>
        </Title>

        <Nav className="toc" id="desktop-toc-content" aria-label="Table of contents" data-collapsed={collapsed ? 'true' : 'false'}>
          <ul>
            {items.map(it => (
              <li key={it.id} className="toc-item" data-level={it.level || 2}>
                <a className={`toc-link${activeId && activeId === it.id ? ' is-active' : ''}`} href={`#${it.id}`}>
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </Nav>
      </Container>
    </Aside>
  )
}

const Aside = styled.aside`
  display: none;
  @media (min-width: 1025px) {
    display: block; height: 100%; /* ensure sticky has a scrolling container */
  }
`

const Container = styled.div`
  position: static; z-index: 1;
  background: transparent; border: 0; border-radius: 0; padding: 0;
  &.collapsed .toc { display: none; }
`

const Title = styled.div`
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; cursor: pointer;
  h4 { font-size: 14px; font-weight: 600; color: var(--color-text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`

const Dot = styled.svg`
  width: 8px; height: 8px; display: block;
`

const Chevron = styled.svg`
  width: 18px; height: 18px; transition: transform 180ms ease;
  &[data-collapsed='true'] { transform: rotate(180deg); }
`

const Nav = styled.nav`
  margin-top: 14px;
  &.toc { font-size: 0.95rem; line-height: 1.5; }
  ul { list-style: none; margin: 0; padding: 0; }
  .toc-item { margin: 6px 0; }
  .toc-link {
    display: block; padding: 4px 0 4px 10px; text-decoration: none; color: var(--color-text-2);
    border-left: 2px solid transparent; word-break: break-word;
    transition: opacity 160ms ease, transform 160ms ease;
  }
  &[data-collapsed='true'] .toc-link { opacity: 0; transform: translateY(-4px); pointer-events: none; }
  .toc-item[data-level='3'] .toc-link { padding-left: 18px; opacity: 0.9; }
  .toc-link:hover { text-decoration: underline; }
  .toc-link.is-active { color: var(--accent); border-left-color: var(--accent); }
`

export default DesktopTOC

