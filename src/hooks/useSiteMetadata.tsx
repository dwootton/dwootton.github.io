// Avoid GraphQL at runtime to fix HTML build error: read metadata from config
// This mirrors the fields exposed in gatsby-config.js siteMetadata
// eslint-disable-next-line @typescript-eslint/no-var-requires
const meta = require("../../gatsby-meta-config")

export interface SiteMetadataShape {
  title?: string
  description?: string
  author?: string
  siteUrl?: string
  lang?: string
  utterances?: { repo?: string }
  postTitle?: string
  menuLinks?: { name: string; link: string }[]
}

const useSiteMetadata = (): SiteMetadataShape => {
  const site: SiteMetadataShape = {
    title: meta.title,
    description: meta.description,
    author: meta.author,
    siteUrl: meta.siteUrl,
    lang: meta.lang,
    utterances: { repo: meta.utterances },
    postTitle: "All",
    menuLinks: [
      { link: "/", name: "Home" },
      { link: "/about/", name: "About" },
      { link: "/atlas/", name: "Atlas" },
      { link: meta.links.github, name: "Github" },
    ],
  }
  return site
}

export type UseSiteMetaDataReturnType = ReturnType<typeof useSiteMetadata>

export default useSiteMetadata


