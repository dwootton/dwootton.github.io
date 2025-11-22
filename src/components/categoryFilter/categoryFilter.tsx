import React, { useRef, useMemo } from "react"
import type { GatsbyLinkProps } from "gatsby"
import styled from "styled-components"
import kebabCase from "lodash/kebabCase"

import useScrollCenter from "./useScrollCenter"
import { useQueryParamString } from "react-use-query-param-string"
const ACTIVE = "active"
const ALL_CATEGORY_NAME = "All"

interface CategoryFilterProps {
  categoryList: readonly Queries.MarkdownRemarkGroupConnection[]
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categoryList }) => {
  const categoryRef = useRef<HTMLUListElement>(null)
  const [category, setCategory] = useQueryParamString("category", "")

  useScrollCenter({ ref: categoryRef, targetId: ACTIVE })

  const sortedCategoryList = useMemo(
    () => [...categoryList].sort((a, b) => b.totalCount - a.totalCount),
    [categoryList]
  )

  return (
    <Nav aria-label="Category Filter">
      <CategoryTitle>Category</CategoryTitle>
      <CategoryButton
        style={
          category == ""
            ? { background: "var(--color-blue)", color: "var(--color-white)" }
            : {}
        }
        onClick={() => setCategory("")}
      >
        {ALL_CATEGORY_NAME}
      </CategoryButton>
      <Divider />
      <CategoryUl ref={categoryRef} className="invisible-scrollbar">
        {sortedCategoryList.map((groupedCategory, i) => {
          const categoryType = groupedCategory.fieldValue as string
          return (
            <li key={i}>
              <CategoryButton
                style={
                  categoryType == category
                    ? {
                        background: "var(--color-blue)",
                        color: "var(--color-white)",
                      }
                    : {}
                }
                onClick={() => setCategory(categoryType)}
              >
                {categoryType}
              </CategoryButton>
            </li>
          )
        })}
      </CategoryUl>
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  background-color: var(--color-card);
  margin-bottom: 48px;
  padding: 12px var(--sizing-md);
  border-radius: var(--border-radius-base);
  scrollbar-width: none;
  scrollbar-height: none;
  a#active {
    color: var(--color-white);
    background-color: var(--color-blue);
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    padding: 12px;
  }
`

const CategoryTitle = styled.em`
  position: static;
  width: auto;
  height: auto;
  clip: auto;
  white-space: auto;

  flex-shrink: 0;
  font-size: var(--text-base);
  font-weight: var(--font-weight-semi-bold);
  font-style: initial;
  margin-right: var(--sizing-lg);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: no-wrap;
  }
`

const CategoryButton = styled.div`
  cursor: pointer;
  display: block;
  background-color: var(--color-category-button);
  padding: var(--sizing-sm) var(--sizing-base);
  border-radius: var(--border-radius-base);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semi-bold);

  :focus {
    outline: none;
  }

  &:hover {
    color: var(--color-white);
    background-color: var(--color-blue);
  }

  &:focus-visible {
    color: var(--color-white);
    background-color: var(--color-blue);
  }
`

const Divider = styled.div`
  width: 1px;
  height: 32px;
  margin: 0 var(--sizing-sm);
  transform: translateX(-50%);
  background-color: var(--color-divider);
`

const CategoryUl = styled.ul`
  display: flex;
  list-style: none;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  li + li {
    margin-left: 6px;
  }

  &::-webkit-scrollbar {
    background: transparent; /* Chrome/Safari/Webkit */
    width: 0px;
    height: 0px;
  }
`

export default CategoryFilter
