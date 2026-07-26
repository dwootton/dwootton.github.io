import React from "react"
import { graphql, navigate } from "gatsby"
import styled from "styled-components"

import Layout from "Layouts/layout"
import SEO from "Components/seo"
import ItemCard from "Components/atlas/ItemCard"
import type { AtlasItem } from "Components/atlas/types"
import {
  navigateWithAtlasTransition,
  setPersistentAtlasHover,
} from "Components/atlas/AtlasTransitionLayer"
import type { AtlasMarkdownEdge } from "Components/atlas/markdownToAtlasItems"
import { markdownEdgesToExpandedAtlasItems } from "Components/atlas/markdownToAtlasItems"

interface AtlasPageProps {
  data: {
    allMarkdownRemark: {
      edges: AtlasMarkdownEdge[]
    }
  }
}

type AtlasFilter = "all" | "project"
type AtlasSort = "recent" | "title"

const searchFieldsForItem = (item: AtlasItem) =>
  [
    item.title,
    item.desc,
    item.category,
    item.subcategory,
    ...item.tags,
    ...item.topics,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

const filterLabel = (filter: AtlasFilter) =>
  ({
    all: "All",
    project: "Projects",
  }[filter])

const sortDateValue = (item: AtlasItem) => {
  const value = new Date(item.date || item.planted_at || "").getTime()
  return Number.isFinite(value) ? value : 0
}

const AtlasPage: React.FC<AtlasPageProps> = ({ data }) => {
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<AtlasFilter>("all")
  const [sort, setSort] = React.useState<AtlasSort>("recent")
  const [visited, setVisited] = React.useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const raw = localStorage.getItem("atlasVisited")
      if (!raw) return new Set()
      return new Set(JSON.parse(raw))
    } catch {
      return new Set()
    }
  })

  const items: AtlasItem[] = React.useMemo(
    () => markdownEdgesToExpandedAtlasItems(data.allMarkdownRemark.edges),
    [data.allMarkdownRemark.edges]
  )

  const filterOptions = React.useMemo(
    () =>
      (["all", "project"] as AtlasFilter[]).map(value => ({
        value,
        label: filterLabel(value),
        count:
          value === "all"
            ? items.length
            : items.filter(item => item.type === value).length,
      })),
    [items]
  )

  const visibleItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items
      .filter(item => filter === "all" || item.type === filter)
      .filter(
        item =>
          !normalizedQuery ||
          searchFieldsForItem(item).includes(normalizedQuery)
      )
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title)
        return sortDateValue(b) - sortDateValue(a)
      })
  }, [filter, items, query, sort])

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return
      }

      event.preventDefault()
      searchRef.current?.focus()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const recordVisit = React.useCallback((slug: string) => {
    setVisited(prev => {
      const next = new Set(prev)
      next.add(slug)
      try {
        localStorage.setItem("atlasVisited", JSON.stringify(Array.from(next)))
      } catch (_) {
        return next
      }
      return next
    })
  }, [])

  const navigateHome = React.useCallback(() => {
    navigateWithAtlasTransition("/")
  }, [])

  const openItem = React.useCallback(
    (slug: string) => {
      recordVisit(slug)
      navigate(slug)
    },
    [recordVisit]
  )

  return (
    <Layout>
      <SEO title="Atlas" />
      <PageWrap>
        <AtlasStage data-atlas-page-anchor="true" aria-label="Atlas projection">
          <BackToHomeButton
            type="button"
            data-atlas-chrome="true"
            onClick={navigateHome}
          >
            &larr; Back to home
          </BackToHomeButton>
        </AtlasStage>

        <ContentWrap data-atlas-chrome="true">
          <Toolbar>
            <SearchShell as="label">
              <SearchIcon aria-hidden="true" />
              <SearchInput
                ref={searchRef}
                type="search"
                value={query}
                placeholder="Search projects and writing..."
                aria-label="Search atlas entries"
                onChange={event => setQuery(event.target.value)}
              />
              <ShortcutBadge>⌘K</ShortcutBadge>
            </SearchShell>
            {filterOptions.map(option => (
              <FilterButton
                key={option.value}
                type="button"
                data-active={filter === option.value ? "true" : "false"}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label} {option.count}
              </FilterButton>
            ))}
            <SortButton
              type="button"
              onClick={() =>
                setSort(current => (current === "recent" ? "title" : "recent"))
              }
            >
              {sort === "recent" ? "Recent" : "A-Z"}
            </SortButton>
          </Toolbar>

          <ResultsPanel aria-label="Atlas entries">
            {visibleItems.length > 0 ? (
              <List>
                {visibleItems.map(item => (
                  <ItemCard
                    key={item.slug}
                    item={item}
                    onHover={setPersistentAtlasHover}
                    onClick={openItem}
                    visited={visited.has(item.slug)}
                    density="compact"
                  />
                ))}
              </List>
            ) : (
              <EmptyState>No atlas entries match this search.</EmptyState>
            )}
          </ResultsPanel>
        </ContentWrap>
      </PageWrap>
    </Layout>
  )
}

const PageWrap = styled.div`
  width: 100%;
  min-height: calc(100vh - var(--nav-height));
  padding: 0 0 72px;
  display: grid;
  gap: 28px;
`

const AtlasStage = styled.section`
  position: relative;
  width: 100%;
  height: min(400px, calc(100vh - var(--nav-height)));
  max-height: 400px;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    height: 260px;
    max-height: 260px;
  }
`

const BackToHomeButton = styled.button`
  position: absolute;
  top: 18px;
  left: var(--decor-rail-width);
  z-index: 4;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 8px 10px;
  border: 1px solid var(--card-border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--color-text);
  box-shadow: 0 6px 18px rgba(50, 42, 32, 0.08);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
  opacity: var(--atlas-atlas-chrome-progress, 1);
  transform: translate3d(0, var(--atlas-atlas-chrome-offset, 0px), 0);
  transition: opacity 250ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: auto;

  &:hover {
    border-color: var(--color-floating-button-border-hover);
    color: var(--accent);
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    left: 16px;
  }
`

const ContentWrap = styled.section`
  width: calc(100% - (var(--decor-rail-width) * 2));
  margin: 0 auto;
  display: grid;
  gap: 16px;
  opacity: var(--atlas-atlas-chrome-progress, 1);
  transform: translate3d(0, var(--atlas-atlas-chrome-offset, 0px), 0);
  transition: opacity 250ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 250ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: min(calc(100% - 32px), 1500px);
  }
`

const Toolbar = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(240px, 360px) repeat(3, auto) 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(80, 70, 55, 0.12);
  border-radius: 11px;
  background: rgba(255, 254, 249, 0.78);
  box-shadow: 0 8px 24px rgba(40, 35, 25, 0.035);

  @media (max-width: ${({ theme }) => theme.device.md}) {
    display: flex;
    overflow-x: auto;
  }
`

const SearchShell = styled.div`
  min-width: 320px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 9px 0 12px;
  border: 1px solid rgba(80, 70, 55, 0.12);
  border-radius: 8px;
  background: rgba(255, 254, 249, 0.86);
  color: rgba(58, 56, 49, 0.48);
  font-size: 0.83rem;
`

const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;

  &::placeholder {
    color: rgba(58, 56, 49, 0.48);
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`

const ShortcutBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 22px;
  border: 1px solid rgba(80, 70, 55, 0.11);
  border-radius: 6px;
  background: rgba(244, 241, 232, 0.84);
  color: rgba(50, 47, 40, 0.56);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
`

const FilterButton = styled.button`
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgba(80, 70, 55, 0.12);
  border-radius: 8px;
  background: rgba(255, 254, 249, 0.72);
  color: rgba(48, 49, 44, 0.78);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;

  &[data-active="true"] {
    border-color: rgba(44, 76, 52, 0.34);
    background: rgba(221, 232, 211, 0.74);
    color: var(--green);
  }

  &:hover {
    border-color: var(--color-floating-button-border-hover);
  }
`

const SortButton = styled.button`
  justify-self: end;
  height: 38px;
  min-width: 92px;
  border: 1px solid rgba(80, 70, 55, 0.12);
  border-radius: 8px;
  background: rgba(255, 254, 249, 0.78);
  color: rgba(48, 49, 44, 0.78);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
`

const ResultsPanel = styled.div`
  height: 500px;
  min-width: 0;
  overflow-y: auto;
  padding: 2px 14px 2px 2px;
  scrollbar-color: rgba(86, 80, 69, 0.25) rgba(255, 254, 249, 0.42);
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 254, 249, 0.42);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    border: 3px solid rgba(255, 254, 249, 0.42);
    border-radius: 999px;
    background: rgba(86, 80, 69, 0.25);
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    height: auto;
    overflow: visible;
    padding: 0;
  }
`

const List = styled.div`
  min-width: 0;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: ${({ theme }) => theme.device.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-template-columns: 1fr;
  }
`

const EmptyState = styled.div`
  min-height: 220px;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(80, 70, 55, 0.18);
  border-radius: 8px;
  background: rgba(255, 254, 249, 0.54);
  color: var(--color-text-3);
  font-size: 0.9rem;
`

function SearchIcon({ "aria-hidden": ariaHidden }: { "aria-hidden": string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={ariaHidden}
    >
      <circle
        cx="11"
        cy="11"
        r="6.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const query = graphql`
  query AtlasPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/essays/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 150)
          frontmatter {
            title
            subtitle
            desc
            category
            date
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  width: 400
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default AtlasPage
