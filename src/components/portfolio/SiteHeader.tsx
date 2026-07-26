import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import { navigateWithAtlasTransition } from "Components/atlas/AtlasTransitionLayer"
import Logo from "Components/navBar/logo"
import type { UseThemeReturnType } from "Hooks/useTheme"
import { DARK } from "Constants/theme"
import { baseCoordinate, coordinatePlace } from "./content"
import { ThemeGlyph } from "./icons"

interface SiteHeaderProps {
  theme: string | null
  themeToggler: UseThemeReturnType["themeToggler"]
}

const navItems = [
  {
    href: "/",
    label: "Home",
    match: (path: string) => path === "/" || path.startsWith("/projects"),
  },
  {
    href: "/research/",
    label: "Research",
    match: (path: string) => path.startsWith("/research"),
  },
  {
    href: "/about/",
    label: "About",
    match: (path: string) => path.startsWith("/about"),
  },
  {
    href: "/atlas/",
    label: "Writing Atlas",
    match: (path: string) =>
      path.startsWith("/atlas") || path.startsWith("/essays"),
  },
]

const SiteHeader: React.FC<SiteHeaderProps> = ({ theme, themeToggler }) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const normalizePath = React.useCallback((path: string) => {
    if (path === "/") return path
    return path.endsWith("/") ? path.slice(0, -1) : path
  }, [])
  const routeThroughAtlasTransition = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const current = normalizePath(pathname)
      const target = normalizePath(href)

      if (current === "/" && target === "/atlas") {
        event.preventDefault()
        navigateWithAtlasTransition("/atlas/")
      }

      if (current === "/atlas" && target === "/") {
        event.preventDefault()
        navigateWithAtlasTransition("/")
      }
    },
    [normalizePath, pathname]
  )

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <Header>
      <Shell>
        <LeftCluster>
          <BrandLink
            to="/"
            aria-label="Go to homepage"
            onClick={event => routeThroughAtlasTransition(event, "/")}
          >
            <LogoWrap>
              <Logo />
            </LogoWrap>
          </BrandLink>
        </LeftCluster>

        <MobileCoordinate aria-hidden="true">
          <span>{coordinatePlace}</span>
          <strong>{baseCoordinate}</strong>
        </MobileCoordinate>

        <DesktopNav aria-label="Primary">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.href}
              data-active={item.match(pathname) ? "true" : "false"}
              onClick={event => routeThroughAtlasTransition(event, item.href)}
            >
              {item.label}
            </NavLink>
          ))}
          <ThemeButton
            type="button"
            onClick={themeToggler}
            aria-label={theme === DARK ? "Use light theme" : "Use dark theme"}
          >
            <ThemeGlyph isDark={theme === DARK} />
          </ThemeButton>
        </DesktopNav>

        <MobileActions>
          <ThemeButton
            type="button"
            onClick={themeToggler}
            aria-label={theme === DARK ? "Use light theme" : "Use dark theme"}
          >
            <ThemeGlyph isDark={theme === DARK} />
          </ThemeButton>
          <MenuButton
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </MenuButton>
        </MobileActions>
      </Shell>

      <MobilePanel id="mobile-nav" data-open={menuOpen ? "true" : "false"}>
        <MobileNav aria-label="Mobile primary">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.href}
              data-active={item.match(pathname) ? "true" : "false"}
              onClick={event => {
                routeThroughAtlasTransition(event, item.href)
                setMenuOpen(false)
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </MobileNav>
      </MobilePanel>
    </Header>
  )
}

const Header = styled.header`
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--decor-guide-strong);
  backdrop-filter: blur(8px);
  background: var(--color-nav-bar);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: -1px;
    width: 1px;
    background: var(--decor-guide);
    pointer-events: none;
  }

  &::before {
    left: var(--decor-rail-width);
  }

  &::after {
    right: var(--decor-rail-width);
  }

  @media (max-width: ${({ theme }) => theme.device.md}) {
    &::before,
    &::after {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    backdrop-filter: none;
  }
`

const Shell = styled.div`
  width: var(--site-shell-width);
  height: var(--nav-height);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) 88px;
    gap: 0;
  }
`

const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(24px, 5vw, 64px);
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: contents;
  }
`

const BrandLink = styled(Link)`
  position: absolute;
  left: calc(var(--decor-rail-width) / 2);
  top: 50%;
  z-index: 1;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transform: translate(-50%, -50%);

  @media (max-width: ${({ theme }) => theme.device.md}) {
    position: static;
    transform: none;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    border-right: 1px solid var(--decor-guide-strong);
  }
`

const LogoWrap = styled.span`
  display: block;
  width: 40px;
  height: 35px;
  color: var(--color-text);
`

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 32px);

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: none;
  }
`

const MobileCoordinate = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-column: 2;
    min-width: 0;
    height: 100%;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 5px;
    padding: 0 12px;
    border-right: 1px solid var(--decor-guide-strong);
    text-align: center;
    font-family: var(--font-mono);
    text-transform: uppercase;

    span,
    strong {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      color: var(--color-text-3);
      font-size: 0.58rem;
      letter-spacing: 0.16em;
      font-weight: 500;
    }

    strong {
      color: var(--color-text);
      font-size: 0.64rem;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
  }
`

const NavLink = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 0 2px;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1;
  color: var(--color-text);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--accent);
    opacity: 0;
    transform: scaleX(0.4);
    transform-origin: center;
    transition: opacity 160ms ease, transform 160ms ease;
  }

  &[data-active="true"]::after {
    opacity: 1;
    transform: scaleX(1);
  }

  &:hover {
    color: var(--accent);
  }
`

const ThemeButton = styled.button`
  box-sizing: border-box;
  flex: 0 0 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  padding: 10px;
  background: transparent;
  color: var(--color-icon);
  cursor: pointer;

  &:hover {
    color: var(--accent);
  }
`

const MobileActions = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    grid-column: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 100%;

    ${ThemeButton} {
      display: none;
    }
  }
`

const MenuButton = styled.button`
  display: inline-grid;
  place-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  border: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: currentColor;
  }

  &:hover {
    color: var(--accent);
  }
`

const MobilePanel = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: block;
    overflow: hidden;
    max-height: 0;
    border-top: 1px solid transparent;
    transition: max-height 180ms ease, border-color 180ms ease;

    &[data-open="true"] {
      max-height: 320px;
      border-color: var(--decor-guide);
    }
  }
`

const MobileNav = styled.nav`
  display: grid;
  gap: 4px;
  width: var(--site-shell-width);
  margin: 0 auto;
  padding: 12px 0 18px;

  a {
    display: block;
    padding: 10px 0;
  }
`

export default SiteHeader
