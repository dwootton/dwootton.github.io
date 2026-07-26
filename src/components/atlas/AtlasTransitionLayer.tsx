import React from "react"
import { graphql, navigate, useStaticQuery } from "gatsby"

import type { AtlasMarkdownEdge } from "./markdownToAtlasItems"
import { markdownEdgesToExpandedAtlasItems } from "./markdownToAtlasItems"
import type { AtlasItem } from "./types"

const ATLAS_NAVIGATE_EVENT = "atlas-transition:navigate"
const ATLAS_ROUTE_UPDATE_EVENT = "atlas-transition:route-update"
const ATLAS_HOVER_EVENT = "atlas-transition:hover"

const TOTAL_MS = 700
const HERO_CLEAR_MS = 200
const FRAME_FADE_MS = 150
const WAVE_START_MS = 80
const WAVE_DURATION_MS = 470
const DOT_FADE_MS = 150
const CHROME_START_MS = 450
const CHROME_DURATION_MS = 250
const GRID_SIZE = 48
const MAP_PAD = 34
const NAV_HEIGHT = 76
const ATLAS_DESKTOP_HEIGHT = 400
const ATLAS_MOBILE_HEIGHT = 260
const HOME_MAP_RADIUS = 8
const HOME_MAP_OPACITY = 0.58

const maskAlpha = (edgeOpacity: number, baseAlpha: number) =>
  1 - edgeOpacity + baseAlpha * edgeOpacity

const maskStop = (edgeOpacity: number, baseAlpha: number) =>
  `rgba(0, 0, 0, ${maskAlpha(edgeOpacity, baseAlpha).toFixed(3)})`

const homeMapMaskX = (edgeOpacity: number) =>
  [
    "linear-gradient(90deg",
    `${maskStop(edgeOpacity, 0)} 0%`,
    `${maskStop(edgeOpacity, 0.08)} 7%`,
    `${maskStop(edgeOpacity, 0.42)} 18%`,
    `${maskStop(edgeOpacity, 0.86)} 32%`,
    "#000 48%",
    "#000 80%",
    `${maskStop(edgeOpacity, 0.76)} 91%`,
    `${maskStop(edgeOpacity, 0)} 100%)`,
  ].join(", ")

const homeMapMaskY = (edgeOpacity: number) =>
  [
    "linear-gradient(180deg",
    `${maskStop(edgeOpacity, 0.04)} 0%`,
    `${maskStop(edgeOpacity, 0.62)} 15%`,
    "#000 28%",
    "#000 80%",
    `${maskStop(edgeOpacity, 0.62)} 91%`,
    `${maskStop(edgeOpacity, 0)} 100%)`,
  ].join(", ")

type RouteView = "home" | "atlas" | "other"
type Direction = "opening" | "closing"

interface AtlasLayerData {
  allMarkdownRemark: {
    edges: AtlasMarkdownEdge[]
  }
}

interface AtlasNavigateDetail {
  to: string
  state?: Record<string, unknown>
}

interface AtlasRouteUpdateDetail {
  pathname?: string
  prevPathname?: string
}

interface ViewportSize {
  w: number
  h: number
}

interface HomeRect {
  left: number
  top: number
  right: number
  bottom: number
}

const sameHomeRect = (a: HomeRect | null, b: HomeRect | null) =>
  a === b ||
  (!!a &&
    !!b &&
    a.left === b.left &&
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom)

const scrollHomeRect = (rect: HomeRect, scrollY: number): HomeRect => ({
  ...rect,
  top: Math.round(rect.top - scrollY),
  bottom: Math.round(rect.bottom - scrollY),
})

interface PlottedAtlasItem extends AtlasItem {
  cx: number
  cy: number
  r: number
}

interface RevealInfo {
  homeVisible: boolean
  start: number
}

interface TimelineRun {
  from: number
  to: number
  start: number
  duration: number
  direction: Direction
  navigation?: AtlasNavigateDetail
  navigated: boolean
}

const normalizePath = (pathname?: string) => {
  if (!pathname) return "/"
  const path = pathname.split("?")[0].split("#")[0]
  if (path === "/") return path
  return path.endsWith("/") ? path.slice(0, -1) : path
}

const routeViewForPath = (pathname?: string): RouteView => {
  const path = normalizePath(pathname)
  if (path === "/") return "home"
  if (path === "/atlas") return "atlas"
  return "other"
}

export function navigateWithAtlasTransition(
  to: string,
  state?: Record<string, unknown>
) {
  if (typeof window === "undefined") {
    void navigate(to, { state })
    return
  }

  const event = new CustomEvent<AtlasNavigateDetail>(ATLAS_NAVIGATE_EVENT, {
    cancelable: true,
    detail: { to, state },
  })
  const wasHandled = !window.dispatchEvent(event)

  if (!wasHandled) {
    void navigate(to, { state })
  }
}

export function setPersistentAtlasHover(slug: string | null) {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent<{ slug: string | null }>(ATLAS_HOVER_EVENT, {
      detail: { slug },
    })
  )
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const atlasPair = (from: RouteView, to: RouteView) =>
  (from === "home" && to === "atlas") || (from === "atlas" && to === "home")

const radiusForType = (type: AtlasItem["type"]) => {
  switch (type) {
    case "project":
    case "route":
      return 5
    case "map":
      return 4.5
    case "waypoint":
      return 3.6
    case "field_note":
    default:
      return 3.1
  }
}

const cubic = (a: number, b: number, c: number, t: number) => {
  const inv = 1 - t
  return 3 * inv * inv * t * a + 3 * inv * t * t * b + t * t * t * c
}

const easeAtlas = (progress: number) => {
  const x1 = 0.22
  const y1 = 1
  const x2 = 0.36
  const y2 = 1
  const target = clamp(progress)
  let low = 0
  let high = 1

  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2
    const x = cubic(x1, x2, 1, mid)
    if (x < target) low = mid
    else high = mid
  }

  return cubic(y1, y2, 1, (low + high) / 2)
}

const inverseEaseAtlas = (eased: number) => {
  const target = clamp(eased)
  let low = 0
  let high = 1

  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2
    if (easeAtlas(mid) < target) low = mid
    else high = mid
  }

  return (low + high) / 2
}

const waveProgressAt = (timeline: number) => {
  const raw = clamp((timeline - WAVE_START_MS) / WAVE_DURATION_MS)
  return easeAtlas(raw)
}

const homeRectForSize = ({ w, h }: ViewportSize): HomeRect => {
  const topInset = Math.round(Math.min(Math.max(92, h * 0.13), 120))
  const contentInset = siteContentInsetForWidth(w)
  const rightInset = contentInset

  if (w < 768) {
    const sideInset = Math.round(Math.min(Math.max(15, w * 0.04), 22))
    const mapTop = Math.round(Math.min(Math.max(318, h * 0.48), 344))
    const mapHeight = Math.round(Math.min(Math.max(182, h * 0.28), 210))

    return {
      left: sideInset,
      top: mapTop,
      right: sideInset,
      bottom: Math.min(mapTop + mapHeight, h - 64),
    }
  }

  if (w < 1120) {
    return {
      left: Math.round(w * 0.38),
      top: topInset,
      right: rightInset,
      bottom: Math.round(Math.min(h * 0.7, 640)),
    }
  }

  return {
    left: Math.round(Math.max(w * 0.46, w - rightInset - 860)),
    top: topInset,
    right: rightInset,
    bottom: Math.round(Math.min(h * 0.68, 680)),
  }
}

const shellGutterForWidth = (width: number) =>
  Math.min(Math.max(24, width * 0.045), 76)

const decorRailInsetForWidth = (width: number) =>
  Math.round(Math.max(48, shellGutterForWidth(width)))

const atlasRectForSize = ({ w, h }: ViewportSize): HomeRect => {
  const horizontalInset = w < 768 ? 16 : decorRailInsetForWidth(w)
  const top = NAV_HEIGHT
  const height = Math.round(
    Math.min(w < 768 ? ATLAS_MOBILE_HEIGHT : ATLAS_DESKTOP_HEIGHT, h - top)
  )

  return {
    left: horizontalInset,
    top,
    right: horizontalInset,
    bottom: top + Math.max(180, height),
  }
}

const siteContentInsetForWidth = (width: number) => {
  const cssGutter = Math.min(Math.max(72, width * 0.105), 176)
  const contentWidth = Math.min(width - cssGutter * 2, 1320)
  return Math.round(Math.max((width - contentWidth) / 2, cssGutter))
}

const plotItems = (
  items: AtlasItem[],
  size: ViewportSize,
  rect: HomeRect
): PlottedAtlasItem[] => {
  if (size.w <= 0 || size.h <= 0) return []

  const xs = items.map(item => item.x)
  const ys = items.map(item => item.y)
  const minX = Math.min(...xs, -1)
  const maxX = Math.max(...xs, 1)
  const minY = Math.min(...ys, -1)
  const maxY = Math.max(...ys, 1)
  const rectWidth = Math.max(1, size.w - rect.left - rect.right)
  const rectHeight = Math.max(1, rect.bottom - rect.top)
  const mapW = Math.max(1, rectWidth - MAP_PAD * 2)
  const mapH = Math.max(1, rectHeight - MAP_PAD * 2)

  return items.map(item => ({
    ...item,
    cx: ((item.x - minX) / (maxX - minX || 1)) * mapW + MAP_PAD + rect.left,
    cy: ((item.y - minY) / (maxY - minY || 1)) * mapH + MAP_PAD + rect.top,
    r: radiusForType(item.type),
  }))
}

const crossingTime = (axisProgress: number) =>
  WAVE_START_MS + inverseEaseAtlas(axisProgress) * WAVE_DURATION_MS

const computeRevealInfo = (
  item: PlottedAtlasItem,
  rect: HomeRect,
  size: ViewportSize
): RevealInfo => {
  const rightEdge = size.w - rect.right
  const homeVisible =
    item.cx >= rect.left &&
    item.cx <= rightEdge &&
    item.cy >= rect.top &&
    item.cy <= rect.bottom
  if (homeVisible) return { homeVisible, start: 0 }

  let xTime = TOTAL_MS
  let yTime = TOTAL_MS

  if (item.cx < rect.left && rect.left > 0) {
    xTime = crossingTime(clamp(1 - item.cx / rect.left))
  } else if (item.cx > rightEdge && rect.right > 0) {
    xTime = crossingTime(clamp((item.cx - rightEdge) / rect.right))
  } else if (item.cx >= rect.left && item.cx <= rightEdge) {
    xTime = WAVE_START_MS
  }

  if (item.cy < rect.top && rect.top > 0) {
    yTime = crossingTime(clamp(1 - item.cy / rect.top))
  } else if (item.cy > rect.bottom && size.h > rect.bottom) {
    yTime = crossingTime(
      clamp((item.cy - rect.bottom) / (size.h - rect.bottom))
    )
  } else if (item.cy >= rect.top && item.cy <= rect.bottom) {
    yTime = WAVE_START_MS
  }

  return {
    homeVisible,
    start: Math.min(xTime, yTime),
  }
}

const dotOpacity = (timeline: number, reveal: RevealInfo) => {
  if (reveal.homeVisible) return 1
  return clamp((timeline - reveal.start) / DOT_FADE_MS)
}

const trendPath = (rect: HomeRect, size: ViewportSize) => {
  const width = Math.max(1, size.w - rect.left - rect.right)
  const height = Math.max(1, rect.bottom - rect.top)
  const left = rect.left
  const top = rect.top
  return `M ${left + MAP_PAD + 20} ${top + height - MAP_PAD - 12} C ${
    left + width * 0.32
  } ${top + height * 0.64}, ${left + width * 0.46} ${
    top + height * 0.48
  }, ${left + width * 0.58} ${top + height * 0.36} S ${
    left + width * 0.82
  } ${top + height * 0.16}, ${left + width - MAP_PAD - 30} ${
    top + MAP_PAD + 16
  }`
}

const buildGridLines = (rect: HomeRect, size: ViewportSize) => {
  const vertical: number[] = []
  const horizontal: number[] = []
  const right = size.w - rect.right

  for (let x = rect.left; x < right; x += GRID_SIZE) {
    vertical.push(x)
  }

  vertical.push(right)

  for (let y = rect.top; y < rect.bottom; y += GRID_SIZE) {
    horizontal.push(y)
  }

  horizontal.push(rect.bottom)

  return { vertical, horizontal }
}

const AtlasTransitionLayer: React.FC = () => {
  const data = useStaticQuery<AtlasLayerData>(graphql`
    query PersistentAtlasLayerQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/essays/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 150)
            fields {
              slug
            }
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
          }
        }
      }
    }
  `)

  const items = React.useMemo(
    () => markdownEdgesToExpandedAtlasItems(data.allMarkdownRemark.edges),
    [data.allMarkdownRemark.edges]
  )
  const [size, setSize] = React.useState<ViewportSize>({ w: 0, h: 0 })
  const [routeView, setRouteView] = React.useState<RouteView>("other")
  const [timeline, setTimeline] = React.useState(0)
  const [hoverSlug, setHoverSlug] = React.useState<string | null>(null)
  const [homeAnchorRect, setHomeAnchorRect] =
    React.useState<HomeRect | null>(null)
  const [homeScrollY, setHomeScrollY] = React.useState(0)
  const [visitedSlugs, setVisitedSlugs] = React.useState<Set<string>>(
    () => new Set()
  )
  const routeViewRef = React.useRef<RouteView>("other")
  const timelineRef = React.useRef(0)
  const rafRef = React.useRef<number | null>(null)
  const runRef = React.useRef<TimelineRun | null>(null)
  const revealRef = React.useRef<Map<string, RevealInfo>>(new Map())

  const readHomeAnchorRect = React.useCallback((): HomeRect | null => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return null
    }

    const anchor = document.querySelector<HTMLElement>(
      "[data-atlas-home-anchor='true']"
    )
    if (!anchor) return null

    const bounds = anchor.getBoundingClientRect()
    if (bounds.width <= 0 || bounds.height <= 0) return null

    return {
      left: Math.max(0, Math.round(bounds.left)),
      top: Math.round(bounds.top),
      right: Math.max(0, Math.round(window.innerWidth - bounds.right)),
      bottom: Math.round(bounds.bottom),
    }
  }, [])

  const activeRunDirection = runRef.current?.direction
  const usesHomeScroll =
    routeView === "home" || activeRunDirection === "opening"
  const homeScrollForRender = usesHomeScroll ? homeScrollY : 0
  const baseRect = React.useMemo(() => homeRectForSize(size), [size])
  const atlasRect = React.useMemo(() => atlasRectForSize(size), [size])
  const rect = React.useMemo(
    () =>
      homeAnchorRect
        ? homeAnchorRect
        : scrollHomeRect(baseRect, homeScrollForRender),
    [baseRect, homeAnchorRect, homeScrollForRender]
  )
  const wave = waveProgressAt(timeline)
  const homeContentOffset = -homeScrollForRender * (1 - wave)
  const homeContentTransform =
    Math.abs(homeContentOffset) > 0.01
      ? `translate(0 ${homeContentOffset.toFixed(2)})`
      : undefined
  const revealRect = React.useMemo(
    () => ({
      ...rect,
      top: Math.round(rect.top - homeContentOffset),
      bottom: Math.round(rect.bottom - homeContentOffset),
    }),
    [homeContentOffset, rect]
  )
  const plottedItems = React.useMemo(
    () => plotItems(items, size, atlasRect),
    [atlasRect, items, size]
  )
  const grid = React.useMemo(
    () => buildGridLines(atlasRect, size),
    [atlasRect, size]
  )

  const refreshRevealInfo = React.useCallback(() => {
    const next = new Map<string, RevealInfo>()
    plottedItems.forEach(item => {
      next.set(item.slug, computeRevealInfo(item, revealRect, size))
    })
    revealRef.current = next
  }, [plottedItems, revealRect, size])

  const syncBodyState = React.useCallback(
    (nextTimeline: number, activeDirection?: Direction | null) => {
      if (typeof document === "undefined") return

      const heroProgress = 1 - clamp(nextTimeline / HERO_CLEAR_MS)
      const frameProgress = 1 - clamp(nextTimeline / FRAME_FADE_MS)
      const chromeProgress = clamp(
        (nextTimeline - CHROME_START_MS) / CHROME_DURATION_MS
      )

      document.body.style.setProperty(
        "--atlas-hero-progress",
        heroProgress.toFixed(4)
      )
      document.body.style.setProperty(
        "--atlas-hero-offset",
        `${(-12 * (1 - heroProgress)).toFixed(2)}px`
      )
      document.body.style.setProperty(
        "--atlas-home-frame-opacity",
        frameProgress.toFixed(4)
      )
      document.body.style.setProperty(
        "--atlas-atlas-chrome-progress",
        chromeProgress.toFixed(4)
      )
      document.body.style.setProperty(
        "--atlas-atlas-chrome-offset",
        `${(10 * (1 - chromeProgress)).toFixed(2)}px`
      )
      document.body.dataset.atlasView = routeViewRef.current
      document.body.dataset.atlasTransition = activeDirection || "idle"
    },
    []
  )

  const finishRun = React.useCallback(() => {
    const run = runRef.current
    runRef.current = null

    if (run?.navigation && !run.navigated) {
      void navigate(run.navigation.to, { state: run.navigation.state })
      run.navigated = true
    }

    const view = routeViewForPath(
      typeof window === "undefined" ? undefined : window.location.pathname
    )
    routeViewRef.current = view
    setRouteView(view)
    syncBodyState(timelineRef.current, null)
  }, [syncBodyState])

  const maybeNavigateForTimeline = React.useCallback((nextTimeline: number) => {
    const run = runRef.current
    if (!run?.navigation || run.navigated) return

    if (run.direction === "opening" && nextTimeline >= CHROME_START_MS) {
      void navigate(run.navigation.to, { state: run.navigation.state })
      run.navigated = true
      return
    }

    if (run.direction === "closing" && nextTimeline <= HERO_CLEAR_MS) {
      void navigate(run.navigation.to, { state: run.navigation.state })
      run.navigated = true
    }
  }, [])

  const stopRun = React.useCallback(() => {
    if (rafRef.current !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = null
    runRef.current = null
  }, [])

  const tick = React.useCallback(
    (now: number) => {
      const run = runRef.current
      if (!run) return

      const progress =
        run.duration <= 0 ? 1 : clamp((now - run.start) / run.duration)
      const nextTimeline = run.from + (run.to - run.from) * progress

      timelineRef.current = nextTimeline
      setTimeline(nextTimeline)
      syncBodyState(nextTimeline, run.direction)
      maybeNavigateForTimeline(nextTimeline)

      if (progress >= 1) {
        rafRef.current = null
        finishRun()
        return
      }

      rafRef.current = window.requestAnimationFrame(tick)
    },
    [finishRun, maybeNavigateForTimeline, syncBodyState]
  )

  const startRun = React.useCallback(
    (target: number, navigation?: AtlasNavigateDetail) => {
      if (typeof window === "undefined") {
        if (navigation)
          void navigate(navigation.to, { state: navigation.state })
        return
      }

      refreshRevealInfo()

      const from = timelineRef.current
      const direction: Direction = target > from ? "opening" : "closing"
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      const duration = reduceMotion ? 1 : Math.abs(target - from)

      stopRun()
      runRef.current = {
        from,
        to: target,
        start: performance.now(),
        duration,
        direction,
        navigation,
        navigated: false,
      }

      syncBodyState(from, direction)
      rafRef.current = window.requestAnimationFrame(tick)
    },
    [refreshRevealInfo, stopRun, syncBodyState, tick]
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined

    const updateHomeAnchor = () => {
      const next = readHomeAnchorRect()
      setHomeAnchorRect(prev => (sameHomeRect(prev, next) ? prev : next))
    }

    const updateHomeScroll = () => {
      const next = Math.max(0, Math.round(window.scrollY || window.pageYOffset))
      setHomeScrollY(prev => (prev === next ? prev : next))
    }

    const updateHomeMetrics = () => {
      if (routeViewRef.current !== "home" && !runRef.current) return

      updateHomeScroll()
      updateHomeAnchor()
    }

    const updateSize = () => {
      const next = {
        w: Math.max(320, window.innerWidth),
        h: Math.max(360, window.innerHeight),
      }

      setSize(prev =>
        prev.w === next.w && prev.h === next.h ? prev : next
      )
      updateHomeMetrics()
    }

    updateSize()
    const rafId = window.requestAnimationFrame(updateSize)
    window.addEventListener("resize", updateSize)
    window.addEventListener("scroll", updateHomeMetrics, { passive: true })

    if ("fonts" in document) {
      void document.fonts.ready.then(updateSize)
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", updateSize)
      window.removeEventListener("scroll", updateHomeMetrics)
    }
  }, [readHomeAnchorRect])

  React.useEffect(() => {
    refreshRevealInfo()
  }, [refreshRevealInfo])

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined

    try {
      const raw = window.localStorage.getItem("atlasVisited")
      setVisitedSlugs(new Set(raw ? JSON.parse(raw) : []))
    } catch (_) {
      setVisitedSlugs(new Set())
    }

    const initialView = routeViewForPath(window.location.pathname)
    routeViewRef.current = initialView
    setRouteView(initialView)
    setHomeScrollY(Math.max(0, Math.round(window.scrollY || window.pageYOffset)))
    const initialTimeline = initialView === "atlas" ? TOTAL_MS : 0
    timelineRef.current = initialTimeline
    setTimeline(initialTimeline)
    syncBodyState(initialTimeline, null)

    const handleRouteUpdate = (event: Event) => {
      const detail = (event as CustomEvent<AtlasRouteUpdateDetail>).detail
      const nextView = routeViewForPath(detail.pathname)

      routeViewRef.current = nextView
      setRouteView(nextView)
      window.requestAnimationFrame(() => {
        const nextRect = readHomeAnchorRect()
        setHomeAnchorRect(prev =>
          sameHomeRect(prev, nextRect) ? prev : nextRect
        )
        setHomeScrollY(
          Math.max(0, Math.round(window.scrollY || window.pageYOffset))
        )
      })

      if (!runRef.current) {
        const nextTimeline = nextView === "atlas" ? TOTAL_MS : 0
        timelineRef.current = nextTimeline
        setTimeline(nextTimeline)
        syncBodyState(nextTimeline, null)
      }
    }

    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<AtlasNavigateDetail>
      const detail = customEvent.detail
      const nextView = routeViewForPath(detail.to)
      const currentView =
        routeViewRef.current === "other"
          ? routeViewForPath(window.location.pathname)
          : routeViewRef.current

      if (!atlasPair(currentView, nextView) && !runRef.current) return

      customEvent.preventDefault()
      startRun(nextView === "atlas" ? TOTAL_MS : 0, detail)
    }

    const handleHover = (event: Event) => {
      setHoverSlug((event as CustomEvent<{ slug: string | null }>).detail.slug)
    }

    window.addEventListener(ATLAS_ROUTE_UPDATE_EVENT, handleRouteUpdate)
    window.addEventListener(ATLAS_NAVIGATE_EVENT, handleNavigate)
    window.addEventListener(ATLAS_HOVER_EVENT, handleHover)

    return () => {
      window.removeEventListener(ATLAS_ROUTE_UPDATE_EVENT, handleRouteUpdate)
      window.removeEventListener(ATLAS_NAVIGATE_EVENT, handleNavigate)
      window.removeEventListener(ATLAS_HOVER_EVENT, handleHover)
      stopRun()
    }
  }, [readHomeAnchorRect, startRun, stopRun, syncBodyState])

  const visible = routeView !== "other" || runRef.current !== null
  const clipLeft = rect.left * (1 - wave) + atlasRect.left * wave
  const clipTop =
    Math.max(0, rect.top) * (1 - wave) + Math.max(0, atlasRect.top) * wave
  const clipRight = rect.right * (1 - wave) + atlasRect.right * wave
  const clipBottom =
    Math.max(0, size.h - rect.bottom) * (1 - wave) +
    Math.max(0, size.h - atlasRect.bottom) * wave
  const frameOpacity = 1 - clamp(timeline / FRAME_FADE_MS)
  const homeMapOpacity = HOME_MAP_OPACITY + (1 - HOME_MAP_OPACITY) * wave
  const frameRadius = HOME_MAP_RADIUS * (1 - wave)
  const clipWidth = Math.max(0, size.w - clipLeft - clipRight)
  const clipHeight = Math.max(0, size.h - clipTop - clipBottom)
  const edgeMaskX = homeMapMaskX(frameOpacity)
  const edgeMaskY = homeMapMaskY(frameOpacity)
  const edgeMaskXStyle = {
    WebkitMaskImage: edgeMaskX,
    maskImage: edgeMaskX,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  } as React.CSSProperties
  const edgeMaskYStyle = {
    WebkitMaskImage: edgeMaskY,
    maskImage: edgeMaskY,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  } as React.CSSProperties
  const hitTargetVisible = visible && routeView !== "other"

  const recordVisit = React.useCallback((slug: string) => {
    setVisitedSlugs(prev => {
      const next = new Set(prev)
      next.add(slug)

      try {
        window.localStorage.setItem(
          "atlasVisited",
          JSON.stringify(Array.from(next))
        )
      } catch (_) {
        return next
      }

      return next
    })
  }, [])

  const openItem = React.useCallback(
    (slug: string) => {
      recordVisit(slug)
      void navigate(slug)
    },
    [recordVisit]
  )

  if (size.w <= 0 || size.h <= 0) return null
  if (!visible) return null

  return (
    <>
      <div
        aria-hidden={!visible}
        data-visible={visible ? "true" : "false"}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 120ms linear",
        }}
      >
        <div
          style={{
            position: "fixed",
            left: `${clipLeft.toFixed(2)}px`,
            top: `${clipTop.toFixed(2)}px`,
            width: `${clipWidth.toFixed(2)}px`,
            height: `${clipHeight.toFixed(2)}px`,
            overflow: "hidden",
            opacity: homeMapOpacity,
            borderRadius: `${frameRadius.toFixed(2)}px`,
            willChange: "left, top, width, height",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...edgeMaskXStyle,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                ...edgeMaskYStyle,
              }}
            >
              <svg
                width={size.w}
                height={size.h}
                viewBox={`0 0 ${size.w} ${size.h}`}
                preserveAspectRatio="none"
                role="img"
                aria-label="Atlas map"
                style={{
                  position: "absolute",
                  left: `${(-clipLeft).toFixed(2)}px`,
                  top: `${(-clipTop).toFixed(2)}px`,
                  width: `${size.w}px`,
                  height: `${size.h}px`,
                  maxWidth: "none",
                }}
              >
                <rect
                  width={size.w}
                  height={size.h}
                  fill="var(--surface)"
                  opacity={wave}
                />
                <g transform={homeContentTransform}>
                  <g
                    stroke="var(--atlas-grid)"
                    strokeWidth={1}
                    shapeRendering="crispEdges"
                  >
                    {grid.vertical.map((x, index) => (
                      <line
                        key={`vx-${index}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={size.h}
                      />
                    ))}
                    {grid.horizontal.map((y, index) => (
                      <line
                        key={`hy-${index}`}
                        x1={0}
                        y1={y}
                        x2={size.w}
                        y2={y}
                      />
                    ))}
                  </g>
                  <path
                    d={trendPath(atlasRect, size)}
                    fill="none"
                    stroke="var(--route-stroke)"
                    strokeWidth="1.1"
                    strokeDasharray="3 7"
                  />
                  <g>
                    {plottedItems.map(item => {
                      const reveal = revealRef.current.get(item.slug) || {
                        homeVisible:
                          item.cx >= revealRect.left &&
                          item.cx <= size.w - revealRect.right &&
                          item.cy >= revealRect.top &&
                          item.cy <= revealRect.bottom,
                        start: 0,
                      }
                      const active = item.slug === hoverSlug
                      const visited = visitedSlugs.has(item.slug)
                      const opacity = dotOpacity(timeline, reveal)

                      return (
                        <g
                          key={item.slug}
                          data-atlas-dot={item.slug}
                          data-home-visible={
                            reveal.homeVisible ? "true" : "false"
                          }
                          opacity={opacity}
                        >
                          {active ? (
                            <circle
                              cx={item.cx}
                              cy={item.cy}
                              r={item.r + 4}
                              fill="none"
                              stroke="var(--route-stroke)"
                              strokeWidth={1.4}
                            />
                          ) : null}
                          <circle
                            cx={item.cx}
                            cy={item.cy}
                            r={item.r}
                            fill={
                              visited
                                ? "var(--atlas-visited)"
                                : "var(--atlas-dot)"
                            }
                          />
                        </g>
                      )
                    })}
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden={!hitTargetVisible}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3,
          display: hitTargetVisible ? "block" : "none",
          pointerEvents: "none",
          opacity: hitTargetVisible ? 1 : 0,
        }}
      >
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-label="Atlas entries"
          style={{
            width: "100vw",
            height: "100vh",
            overflow: "visible",
          }}
        >
          <g transform={homeContentTransform}>
            {hitTargetVisible
              ? plottedItems.map(item => {
                  const reveal = revealRef.current.get(item.slug) || {
                    homeVisible:
                      item.cx >= revealRect.left &&
                      item.cx <= size.w - revealRect.right &&
                      item.cy >= revealRect.top &&
                      item.cy <= revealRect.bottom,
                    start: 0,
                  }
                  const opacity = dotOpacity(timeline, reveal)

                  if (opacity <= 0.05) return null

                  return (
                    <circle
                      key={item.slug}
                      cx={item.cx}
                      cy={item.cy}
                      r={Math.max(item.r + 9, 14)}
                      fill="transparent"
                      role="link"
                      tabIndex={0}
                      aria-label={item.title}
                      onClick={() => openItem(item.slug)}
                      onMouseEnter={() => setHoverSlug(item.slug)}
                      onMouseLeave={() => setHoverSlug(null)}
                      onFocus={() => setHoverSlug(item.slug)}
                      onBlur={() => setHoverSlug(null)}
                      onKeyDown={event => {
                        if (event.key !== "Enter" && event.key !== " ") return
                        event.preventDefault()
                        openItem(item.slug)
                      }}
                      style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                      }}
                    />
                  )
                })
              : null}
          </g>
        </svg>
      </div>
    </>
  )
}

export default AtlasTransitionLayer
