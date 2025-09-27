import React from "react"
import Layout from "Layouts/layout"
import SEO from "Components/seo"
import Atlas from "Components/atlas/Atlas"

const AtlasPage: React.FC = () => (
  <Layout>
    <SEO title="Atlas" />
    <Atlas />
  </Layout>
)

export default AtlasPage
