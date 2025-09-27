import React from "react"
import styled, { ThemeProvider } from "styled-components"

import ThemeContext from "Stores/themeContext"
import useTheme from "Hooks/useTheme"
import useSiteMetadata from "Hooks/useSiteMetadata"
import NavBar from "Components/navBar/navBar"
import styledTheme from "Styles/styledTheme"
import GlobalStyle from "Styles/globalStyle"
import packageJSON from "../../package.json"
import logoAnimation from "../../logo.json"

const { name, homepage } = packageJSON

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme, themeToggler } = useTheme()
  const { title, author } = useSiteMetadata()
  const [splashMounted, setSplashMounted] = React.useState(false)
  const [splashVisible, setSplashVisible] = React.useState(false)
  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    let timeoutId: number | undefined
    let animation: any

    // Only run on client
    const run = async () => {
      if (typeof window === "undefined" || typeof document === "undefined") return

      // Decide whether to show splash
      const ALWAYS = String(process.env.GATSBY_SPLASH_ALWAYS || "").toLowerCase() === "true"

      let cameFromOutside = true
      try {
        const ref = document.referrer
        if (ref) {
          const refHost = new URL(ref).host
          cameFromOutside = refHost !== window.location.host
        } else {
          // No referrer => consider as outside (typed/bookmark)
          cameFromOutside = true
        }
      } catch (_) {
        cameFromOutside = true
      }

      let cooldownOk = true
      try {
        const last = window.localStorage.getItem("splashLastShownAt")
        if (last) {
          const lastAt = parseInt(last, 10)
          const now = Date.now()
          cooldownOk = now - lastAt >= 10 * 60 * 1000 // 10 minutes
        }
      } catch (_) {
        cooldownOk = true
      }

      const shouldShow = ALWAYS || (cameFromOutside && cooldownOk)
      if (!shouldShow) {
        setSplashMounted(false)
        setSplashVisible(false)
        return
      }

      // Mount and fade-in
      setSplashMounted(true)
      requestAnimationFrame(() => setSplashVisible(true))

      try {
        const lottie = await import("lottie-web")
        if (lottieContainerRef.current) {
          animation = lottie.default.loadAnimation({
            container: lottieContainerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: logoAnimation as any,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
            },
          })
        }
      } catch (e) {
        // If lottie fails to load, just skip the splash quickly
        // eslint-disable-next-line no-console
        console.warn("Lottie failed to load:", e)
      } finally {
        timeoutId = window.setTimeout(() => {
          setSplashVisible(false)
          setSplashMounted(false)
          try {
            window.localStorage.setItem("splashLastShownAt", String(Date.now()))
          } catch (_) {
            // ignore
          }
        }, 2800)
      }
    }

    run()

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      try {
        if (animation && typeof animation.destroy === "function") {
          animation.destroy()
        }
      } catch (_) {
        // ignore
      }
    }
  }, [])

  return (
    <ThemeProvider theme={styledTheme}>
      <ThemeContext.Provider value={theme}>
        <GlobalStyle />
        {splashMounted && (
          <SplashOverlay role="status" aria-live="polite" aria-label="Loading" data-visible={splashVisible}>
            <SplashInner>
              <LottieBox ref={lottieContainerRef} />
            </SplashInner>
          </SplashOverlay>
        )}
        <Container>
          <NavBar title={title} themeToggler={themeToggler} />
          {children}
        </Container>
        <Footer role="contentinfo"></Footer>
      </ThemeContext.Provider>
    </ThemeProvider>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - var(--footer-height));
  background-color: var(--color-post-background);
`

const Footer = styled.footer`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: var(--footer-height);
  background-color: var(--color-gray-1);
`

const Copyright = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-weight-regular);
  color: var(--color-gray-6);
`

const RepoLink = styled.a`
  color: var(--color-blue);
  &:hover {
    text-decoration: underline;
  }
`

export default Layout

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
  &[data-visible='true'] {
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
`
