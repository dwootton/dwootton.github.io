import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import mdxComponents from './src/components/mdx'
import AtlasTransitionLayer from './src/components/atlas/AtlasTransitionLayer'

export const wrapRootElement = ({ element }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <AtlasTransitionLayer />
      {element}
    </MDXProvider>
  )
}

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent("atlas-transition:route-update", {
      detail: {
        pathname: location && location.pathname,
        prevPathname: prevLocation && prevLocation.pathname,
      },
    })
  )
}
