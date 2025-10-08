import React from "react"
import styled, { ThemeProvider } from "styled-components"

import ThemeContext from "Stores/themeContext"
import useTheme from "Hooks/useTheme"
import useSiteMetadata from "Hooks/useSiteMetadata"
import NavBar from "Components/navBar/navBar"
import styledTheme from "Styles/styledTheme"
import GlobalStyle from "Styles/globalStyle"
import TopoBackground from "Components/TopoBackground"
import packageJSON from "../../package.json"
import logoAnimation from "../../logo.json"

const { name, homepage } = packageJSON

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme, themeToggler } = useTheme()
  const { title, author, menuLinks } = useSiteMetadata()
  const [splashMounted, setSplashMounted] = React.useState(false)
  const [splashVisible, setSplashVisible] = React.useState(false)
  const [appVisible, setAppVisible] = React.useState(false)
  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null)
  const lottieModuleRef = React.useRef<any | null>(null)
  const lottieAnimRef = React.useRef<any | null>(null)
  const [darkFilterFallback, setDarkFilterFallback] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: number | undefined
    let unmountTimeoutId: number | undefined
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
        setAppVisible(true)
        return
      }

      // Mount and fade-in
      setSplashMounted(true)
      requestAnimationFrame(() => setSplashVisible(true))
      setAppVisible(false)

      try {
        const lottie = await import("lottie-web")
        lottieModuleRef.current = lottie.default || lottie

        // choose animation by theme
        const getAnimationData = async (t: string | null) => {
          if (t === "dark") {
            try {
              const res = await fetch("/logo-dark.json", { credentials: "same-origin" })
              if (res.ok) {
                const data = await res.json()
                setDarkFilterFallback(false)
                return data
              }
            } catch (_) {
              // ignore
            }
            // fallback to light asset with filter
            setDarkFilterFallback(true)
          }
          return logoAnimation as any
        }

        if (lottieContainerRef.current) {
          const data = await getAnimationData(theme)
          animation = lottieModuleRef.current.loadAnimation({
            container: lottieContainerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData: data,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
            },
          })
          lottieAnimRef.current = animation
        }
      } catch (e) {
        // If lottie fails to load, just skip the splash quickly
        // eslint-disable-next-line no-console
        console.warn("Lottie failed to load:", e)
      } finally {
        timeoutId = window.setTimeout(() => {
          // Start app fade-in as splash ends
          setAppVisible(true)
          setSplashVisible(false)
          // Unmount splash after fade-out window
          unmountTimeoutId = window.setTimeout(() => {
            setSplashMounted(false)
          }, 500)
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
      if (unmountTimeoutId) window.clearTimeout(unmountTimeoutId)
      try {
        if (animation && typeof animation.destroy === "function") {
          animation.destroy()
        }
      } catch (_) {
        // ignore
      }
    }
  }, [])

  // If theme changes while splash is visible, reload animation with matching asset
  React.useEffect(() => {
    const reloadForTheme = async () => {
      if (!splashMounted) return
      if (!lottieModuleRef.current || !lottieContainerRef.current) return

      try {
        // destroy existing
        if (lottieAnimRef.current && typeof lottieAnimRef.current.destroy === "function") {
          lottieAnimRef.current.destroy()
        }

        // load appropriate data
        let data: any = logoAnimation
        if (theme === "dark") {
          try {
            const res = await fetch("/logo-dark.json", { credentials: "same-origin" })
            if (res.ok) {
              data = await res.json()
              setDarkFilterFallback(false)
            } else {
              setDarkFilterFallback(true)
            }
          } catch (_) {
            data = logoAnimation as any
            setDarkFilterFallback(true)
          }
        }

        lottieAnimRef.current = lottieModuleRef.current.loadAnimation({
          container: lottieContainerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        })
      } catch (_) {
        // ignore reload errors
      }
    }

    reloadForTheme()
  }, [theme, splashMounted])

  return (
    <ThemeProvider theme={styledTheme}>
      <ThemeContext.Provider value={theme}>
        <GlobalStyle />
        {splashMounted && (
          <SplashOverlay role="status" aria-live="polite" aria-label="Loading" data-visible={splashVisible}>
            <SplashInner>
              <LottieBox ref={lottieContainerRef} data-dark-fallback={darkFilterFallback && theme === "dark" ? "true" : "false"} />
            </SplashInner>
          </SplashOverlay>
        )}
        <PageWrap>
          <TopoBackground />
          <Container data-visible={appVisible ? "true" : "false"}>
            <NavBar title={title} themeToggler={themeToggler} />
            {children}
          </Container>
        </PageWrap>
        <Footer role="contentinfo">
          <FooterInner>
            <FooterLeft>
              <FooterTitle>Want to stay up to date?</FooterTitle>
              <RssButton href="/rss.xml" aria-label="Subscribe via RSS Feed">Subscribe via RSS Feed</RssButton>
              <SmallPrint>© {new Date().getFullYear()} {author}</SmallPrint>
            </FooterLeft>
            <FooterRight>
              <FooterNavList aria-label="Footer navigation">
                {menuLinks?.map(link => (
                  <li key={link.name}><a href={link.link}>{link.name}</a></li>
                ))}
              </FooterNavList>
            </FooterRight>
          </FooterInner>
        </Footer>
      </ThemeContext.Provider>
    </ThemeProvider>
  )
}

const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - var(--footer-height));
  opacity: 0;
  transition: opacity 0.5s ease;
  &[data-visible='true'] {
    opacity: 1;
  }
`

const PageWrap = styled.div`
  position: relative;
  min-height: calc(100vh - var(--footer-height));
`

const Footer = styled.footer`
  width: 100%;
  background: var(--color-post-background);
  border-top: 1px solid var(--color-divider);
`

const FooterInner = styled.div`
  width: 87.5%; max-width: var(--width); margin: 0 auto; padding: 28px 0 36px;
  display: grid; grid-template-columns: 1fr auto; gap: 24px;
  /* Slightly lighter in light mode, slightly darker in dark mode */
  color: var(--color-text-3);
`

const FooterLeft = styled.div`
  display: grid; gap: 12px; align-content: start;
`

const FooterRight = styled.nav`
  display: grid; align-content: start;
`

const FooterTitle = styled.h2`
  margin: 0; font-size: 18px; color: inherit;
`

const RssButton = styled.a`
  /* Make the RSS button a small, intrinsic-width button */
  justify-self: start;
  display: inline-block; font-size: 14px; color: inherit;
  border: 1px solid var(--color-divider); border-radius: 999px; padding: 6px 12px;
  background: var(--color-card);
  text-decoration: none;
  &:hover { border-color: var(--accent); color: var(--accent); }
`

const SmallPrint = styled.div`
  font-size: 12px; color: var(--color-text-3);
`

const FooterNavList = styled.ul`
  margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; grid-auto-rows: min-content;
  a { color: inherit; text-decoration: none; }
  a:hover { color: var(--accent); }
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
  &[data-dark-fallback='true'] {
    filter: invert(1);
  }
`
