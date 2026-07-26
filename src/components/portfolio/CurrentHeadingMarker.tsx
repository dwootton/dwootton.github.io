import React from "react"
import styled from "styled-components"

type MarkerPosition = {
  x: number
  y: number
  visible: boolean
}

interface CurrentHeadingMarkerProps {
  containerRef: React.RefObject<HTMLElement>
  headingSelector?: string
  markerSize?: number
  offsetX?: number
  className?: string
}

const activationRootMargin = "-20% 0px -65% 0px"

const CurrentHeadingMarker: React.FC<CurrentHeadingMarkerProps> = ({
  containerRef,
  headingSelector = "h2, h3",
  markerSize = 10,
  offsetX = 18,
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const headingsRef = React.useRef<HTMLElement[]>([])
  const [activeHeading, setActiveHeading] = React.useState<HTMLElement | null>(null)
  const [position, setPosition] = React.useState<MarkerPosition>({
    x: 0,
    y: 0,
    visible: false,
  })
  const [isSettled, setIsSettled] = React.useState(true)

  const computeActiveHeading = React.useCallback(() => {
    const headings = headingsRef.current
    if (!headings.length || typeof window === "undefined") {
      setActiveHeading(null)
      return
    }

    const activationY = window.innerHeight * 0.32
    let current: HTMLElement | null = headings[0]

    for (const heading of headings) {
      const rect = heading.getBoundingClientRect()

      if (rect.top <= activationY) {
        current = heading
      } else {
        break
      }
    }

    setActiveHeading(previous => (previous === current ? previous : current))
  }, [])

  const updatePosition = React.useCallback(() => {
    const container = containerRef.current
    const heading = activeHeading

    if (!container || !heading) {
      setPosition(previous => ({ ...previous, visible: false }))
      return
    }

    const containerRect = container.getBoundingClientRect()
    const headingRect = heading.getBoundingClientRect()

    setPosition({
      x: headingRect.left - containerRect.left - offsetX - markerSize,
      y: headingRect.top - containerRect.top + headingRect.height / 2 - markerSize / 2,
      visible: true,
    })
  }, [activeHeading, containerRef, markerSize, offsetX])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === "undefined") return

    let frame = 0
    let intersectionObserver: IntersectionObserver | null = null

    const scheduleActiveUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(computeActiveHeading)
    }

    const refreshHeadings = () => {
      intersectionObserver?.disconnect()

      const headings = Array.from(
        container.querySelectorAll<HTMLElement>(headingSelector)
      ).filter(heading => heading.textContent?.trim())

      ensureHeadingIds(headings)
      headingsRef.current = headings

      if (!headings.length || typeof IntersectionObserver === "undefined") {
        setActiveHeading(null)
        setPosition(previous => ({ ...previous, visible: false }))
        return
      }

      intersectionObserver = new IntersectionObserver(scheduleActiveUpdate, {
        root: null,
        rootMargin: activationRootMargin,
        threshold: 0,
      })

      headings.forEach(heading => intersectionObserver?.observe(heading))
      scheduleActiveUpdate()
    }

    refreshHeadings()

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(refreshHeadings)

    mutationObserver?.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => {
      window.cancelAnimationFrame(frame)
      intersectionObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [computeActiveHeading, containerRef, headingSelector])

  React.useEffect(() => {
    updatePosition()

    if (!activeHeading || prefersReducedMotion) return

    setIsSettled(false)
    const frame = window.requestAnimationFrame(() => setIsSettled(true))

    return () => window.cancelAnimationFrame(frame)
  }, [activeHeading, prefersReducedMotion, updatePosition])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === "undefined") return

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updatePosition)

    resizeObserver?.observe(container)

    if (activeHeading) {
      resizeObserver?.observe(activeHeading)
    }

    const handleResize = () => {
      computeActiveHeading()
      updatePosition()
    }

    window.addEventListener("resize", handleResize)

    let cancelled = false
    const fonts = "fonts" in document ? document.fonts : undefined
    fonts?.ready.then(() => {
      if (cancelled) return
      computeActiveHeading()
      updatePosition()
    })

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [activeHeading, computeActiveHeading, containerRef, updatePosition])

  return (
    <Marker
      aria-hidden="true"
      className={className}
      data-visible={position.visible ? "true" : "false"}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      style={{
        "--marker-size": `${markerSize}px`,
        "--marker-x": `${position.x}px`,
        "--marker-y": `${position.y}px`,
        "--marker-scale": isSettled ? "1" : "0.9",
        "--marker-rotation": isSettled ? "0deg" : "2deg",
      } as React.CSSProperties & Record<string, string>}
    >
      <SurveyTile viewBox="0 0 10 10" focusable="false">
        <path d="M1.1 1.2L8.7 0.9L9.1 8.6L1.3 9Z" />
      </SurveyTile>
    </Marker>
  )
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setPrefersReducedMotion(media.matches)

    handleChange()

    if (media.addEventListener) {
      media.addEventListener("change", handleChange)
      return () => media.removeEventListener("change", handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  return prefersReducedMotion
}

function ensureHeadingIds(headings: HTMLElement[]): void {
  const seen = new Set<string>()

  headings.forEach(heading => {
    if (heading.id) {
      seen.add(heading.id)
      return
    }

    const base = slugify(heading.textContent || "section")
    let id = base
    let index = 2

    while (seen.has(id) || idBelongsToAnotherElement(id, heading)) {
      id = `${base}-${index}`
      index += 1
    }

    heading.id = id
    seen.add(id)
  })
}

function idBelongsToAnotherElement(id: string, heading: HTMLElement): boolean {
  const existing = document.getElementById(id)
  return Boolean(existing && existing !== heading)
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section"
  )
}

const Marker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: var(--marker-size);
  height: var(--marker-size);
  pointer-events: none;
  opacity: 0;
  transform:
    translate3d(var(--marker-x), var(--marker-y), 0)
    scale(var(--marker-scale))
    rotate(var(--marker-rotation));
  transform-origin: 50% 50%;
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease;
  will-change: transform;

  &[data-visible="true"] {
    opacity: 1;
  }

  &[data-reduced-motion="true"] {
    transition: opacity 80ms ease;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    display: none;
  }
`

const SurveyTile = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 2px 3px rgba(50, 42, 32, 0.16));

  path {
    fill: var(--survey-marker, #f4c542);
    stroke: var(--survey-marker-stroke, rgba(70, 50, 10, 0.35));
    stroke-width: 0.7;
    vector-effect: non-scaling-stroke;
  }
`

export default CurrentHeadingMarker
