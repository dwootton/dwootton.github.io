import React from "react"
import styled, { css, ThemeProvider } from "styled-components"
import type { AnimationConfigWithData, AnimationItem, LottiePlayer } from "lottie-web"

import ThemeContext from "Stores/themeContext"
import useTheme from "Hooks/useTheme"
import styledTheme from "Styles/styledTheme"
import GlobalStyle from "Styles/globalStyle"
import SiteHeader from "Components/portfolio/SiteHeader"
import SiteFooter from "Components/portfolio/SiteFooter"
import logoAnimation from "../../logo.json"

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme, themeToggler } = useTheme()
  const initialThemeRef = React.useRef(theme)
  const [splashMounted, setSplashMounted] = React.useState(false)
  const [splashVisible, setSplashVisible] = React.useState(false)
  const [appVisible, setAppVisible] = React.useState(false)
  const [darkFilterFallback, setDarkFilterFallback] = React.useState(false)
  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null)
  const lottieModuleRef = React.useRef<LottiePlayer | null>(null)
  const lottieAnimRef = React.useRef<AnimationItem | null>(null)

  const getSplashAnimationData = React.useCallback(
    async (currentTheme: string | null): Promise<AnimationConfigWithData["animationData"]> => {
      if (currentTheme === "dark") {
        try {
          const res = await fetch("/logo-dark.json", { credentials: "same-origin" })
          if (res.ok) {
            setDarkFilterFallback(false)
            return res.json()
          }
        } catch (_) {
          // Fall back to the light animation with a filter.
        }

        setDarkFilterFallback(true)
      }

      return logoAnimation
    },
    []
  )

  React.useEffect(() => {
    let timeoutId: number | undefined
    let unmountTimeoutId: number | undefined
    let animation: AnimationItem | null = null

    const run = async () => {
      if (typeof window === "undefined" || typeof document === "undefined") return

      const always =
        String(process.env.GATSBY_SPLASH_ALWAYS || "").toLowerCase() === "true"
      let cameFromOutside = false

      try {
        const referrer = document.referrer
        if (referrer) {
          const referrerHost = new URL(referrer).hostname.replace(/^www\./, "")
          const currentHost = window.location.hostname.replace(/^www\./, "")
          cameFromOutside = referrerHost !== currentHost
        }
      } catch (_) {
        cameFromOutside = false
      }

      let cooldownOk = true

      try {
        const lastShown = window.localStorage.getItem("splashLastShownAt")
        if (lastShown) {
          cooldownOk = Date.now() - parseInt(lastShown, 10) >= 10 * 60 * 1000
        }
      } catch (_) {
        cooldownOk = true
      }

      let shownThisSession = false

      try {
        shownThisSession =
          window.sessionStorage.getItem("splashShownThisSession") === "true"
      } catch (_) {
        shownThisSession = false
      }

      const shouldShow =
        always || (cameFromOutside && cooldownOk && !shownThisSession)

      if (!shouldShow) {
        setSplashMounted(false)
        setSplashVisible(false)
        setAppVisible(true)
        return
      }

      setSplashMounted(true)
      try {
        window.sessionStorage.setItem("splashShownThisSession", "true")
      } catch (_) {
        // Ignore storage failures.
      }
      window.requestAnimationFrame(() => setSplashVisible(true))
      setAppVisible(false)

      try {
        const lottie = await import("lottie-web")
        lottieModuleRef.current = (lottie.default || lottie) as LottiePlayer

        if (lottieContainerRef.current) {
          animation = lottieModuleRef.current.loadAnimation({
            container: lottieContainerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: await getSplashAnimationData(initialThemeRef.current),
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
            },
          })
          lottieAnimRef.current = animation
        }
      } catch (error) {
        console.warn("Lottie failed to load:", error)
      } finally {
        timeoutId = window.setTimeout(() => {
          setAppVisible(true)
          setSplashVisible(false)
          unmountTimeoutId = window.setTimeout(() => setSplashMounted(false), 500)

          try {
            window.localStorage.setItem("splashLastShownAt", String(Date.now()))
          } catch (_) {
            // Ignore storage failures.
          }
        }, 2800)
      }
    }

    run()

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      if (unmountTimeoutId) window.clearTimeout(unmountTimeoutId)
      animation?.destroy()
    }
  }, [getSplashAnimationData])

  React.useEffect(() => {
    const reloadForTheme = async () => {
      if (!splashMounted || !lottieModuleRef.current || !lottieContainerRef.current) return

      lottieAnimRef.current?.destroy()
      lottieAnimRef.current = lottieModuleRef.current.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: await getSplashAnimationData(theme),
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      })
    }

    reloadForTheme()
  }, [getSplashAnimationData, splashMounted, theme])

  return (
    <ThemeProvider theme={styledTheme}>
      <ThemeContext.Provider value={theme}>
        <GlobalStyle />
        {splashMounted && (
          <SplashOverlay
            role="status"
            aria-live="polite"
            aria-label="Loading"
            data-visible={splashVisible ? "true" : "false"}
          >
            <SplashInner>
              <LottieBox
                ref={lottieContainerRef}
                data-dark-fallback={
                  darkFilterFallback && theme === "dark" ? "true" : "false"
                }
              />
            </SplashInner>
          </SplashOverlay>
        )}
        <PageRoot>
          <DecorLayer aria-hidden="true">
            <DegreeRuler $side="left" />
            <DegreeRuler $side="right" />
          </DecorLayer>
          <SiteHeader theme={theme} themeToggler={themeToggler} />
          <AppFrame data-visible={appVisible ? "true" : "false"}>
            <Main>{children}</Main>
            <SiteFooter />
          </AppFrame>
        </PageRoot>
      </ThemeContext.Provider>
    </ThemeProvider>
  )
}

const PageRoot = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: clip;
  --decor-rail-width: max(48px, var(--shell-gutter));
`

const DecorLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`

const DegreeRuler = styled.div<{ $side: "left" | "right" }>`
  position: absolute;
  top: var(--nav-height);
  bottom: 0;
  width: var(--decor-rail-width);
  opacity: 0.58;
  ${p =>
    p.$side === "left"
      ? css`
          left: 0;
          border-right: 1px solid var(--decor-guide);
        `
      : css`
          right: 0;
          border-left: 1px solid var(--decor-guide);
        `}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 24px;
    background-image: repeating-linear-gradient(
      to bottom,
      var(--degree-ruler-line) 0,
      var(--degree-ruler-line) 1px,
      transparent 1px,
      transparent 48px
    );
    background-position-y: 0;
    ${p =>
      p.$side === "left"
        ? css`
            right: -1px;
            mask-image: linear-gradient(90deg, transparent, #000 58%);
          `
        : css`
            left: -1px;
            mask-image: linear-gradient(270deg, transparent, #000 58%);
          `}
  }

  &::after {
    content: "";
    position: absolute;
    top: 42%;
    width: 30px;
    height: 1px;
    background: var(--atlas-ribbon-rule);
    ${p =>
      p.$side === "left"
        ? css`
            right: -1px;
          `
        : css`
            left: -1px;
          `}
  }

  @media (max-width: ${({ theme }) => theme.device.md}) {
    display: none;
  }
`

const AppFrame = styled.div`
  opacity: 0;
  transition: opacity 0.5s ease;

  &[data-visible="true"] {
    opacity: 1;
  }
`

const Main = styled.main`
  position: relative;
  z-index: 1;
`

const SplashOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-post-background);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s ease;

  &[data-visible="true"] {
    opacity: 1;
  }
`

const SplashInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(40vmin, 320px);
  height: min(40vmin, 320px);
`

const LottieBox = styled.div`
  width: 100%;
  height: 100%;

  &[data-dark-fallback="true"] {
    filter: invert(1);
  }
`

export default Layout
