const React = require("react")
const { MDXProvider } = require("@mdx-js/react")
const mdxComponents = require("./src/components/mdx").default

exports.wrapRootElement = ({ element }) => {
  return React.createElement(
    MDXProvider,
    { components: mdxComponents },
    element
  )
}

exports.onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  // Authoritative SVG favicon; script below swaps light/dark after hydration
  setHeadComponents([
    React.createElement("link", {
      id: "site-favicon",
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon-light.svg?v=2",
      key: "site-favicon",
    }),
    // Optional: pinned tab icon for Safari (monochrome SVG)
    React.createElement("link", {
      rel: "mask-icon",
      href: "/favicon-dark.svg?v=2",
      color: "#111111",
      key: "mask-icon",
    }),
  ])
  setPreBodyComponents([
    React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: `
          (() => {    
            window.__onThemeChange = function() {};

            function updateFavicon(theme) {
              try {
                var head = document.head || document.getElementsByTagName('head')[0];
                var link = document.querySelector('link#site-favicon');
                if (!link) {
                  link = document.createElement('link');
                  link.id = 'site-favicon';
                  link.rel = 'icon';
                  link.type = 'image/svg+xml';
                  head.appendChild(link);
                }
                var ver = 'v=2';
                link.href = (theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg') + '?' + ver;
              } catch (e) {
                // noop
              }
            }

            function setTheme(newTheme) {                  
              window.__theme = newTheme;                  
              preferredTheme = newTheme;                  
              document.body.className = newTheme;
              document.body.dataset.theme = newTheme;                 
              updateFavicon(newTheme);
              window.__onThemeChange(newTheme);                
            }

            let preferredTheme

            try {
              preferredTheme = localStorage.getItem('theme')
            } catch (err) {}

            window.__setPreferredTheme = newTheme => {
              setTheme(newTheme)

              try {
                localStorage.setItem('theme', newTheme)
              } catch (err) {}
            }

            let darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

            darkQuery.addEventListener('change', e => {
              window.__setPreferredTheme(e.matches ? 'dark' : 'light')
            })

            setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))
          })()
        `,
      },
    }),
  ])
}
