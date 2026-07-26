import styled from "styled-components"
import type typography from "./typography"

const Markdown = styled.article<{ rhythm: typeof typography["rhythm"] }>`
  min-width: 0;
  max-width: 100%;
  color: var(--color-text);

  & > * {
    max-width: 100%;
  }

  & > *:first-child {
    margin-top: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-serif);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }

  h1 {
    font-size: clamp(2.25rem, 4vw, 3.45rem);
    line-height: 0.98;
    margin-bottom: ${({ rhythm }) => rhythm(1)};
  }

  h2 {
    font-size: clamp(1.7rem, 2vw, 2.2rem);
    line-height: 1.06;
    margin-top: ${({ rhythm }) => rhythm(2.4)};
    margin-bottom: ${({ rhythm }) => rhythm(0.8)};
  }

  h3 {
    font-size: clamp(1.35rem, 1.4vw, 1.65rem);
    line-height: 1.14;
    margin-top: ${({ rhythm }) => rhythm(1.8)};
    margin-bottom: ${({ rhythm }) => rhythm(0.65)};
  }

  h4,
  h5,
  h6 {
    margin-top: ${({ rhythm }) => rhythm(1.4)};
    margin-bottom: ${({ rhythm }) => rhythm(0.45)};
  }

  p,
  li,
  blockquote {
    font-size: 1rem;
    line-height: 1.78;
    color: var(--color-text-2);
    overflow-wrap: break-word;
  }

  p {
    margin-bottom: ${({ rhythm }) => rhythm(1.05)};
  }

  strong {
    font-weight: 600;
    color: var(--color-text);
  }

  a {
    color: var(--accent) !important;
    text-decoration: underline;
    text-decoration-color: rgba(155, 104, 71, 0.28);
    text-underline-offset: 0.18em;

    * {
      color: inherit !important;
    }

    &:hover {
      text-decoration-color: rgba(155, 104, 71, 0.6);
    }
  }

  ul,
  ol {
    margin: ${({ rhythm }) => rhythm(1)} 0 ${({ rhythm }) => rhythm(1)} ${({ rhythm }) => rhythm(1.2)};
  }

  li {
    margin-bottom: ${({ rhythm }) => rhythm(0.3)};
  }

  hr {
    height: 1px;
    border: 0;
    margin: ${({ rhythm }) => rhythm(1.8)} 0;
    background: var(--color-divider);
  }

  blockquote {
    margin: ${({ rhythm }) => rhythm(1.3)} 0;
    padding: 0.1rem 0 0.1rem 1rem;
    border-left: 2px solid rgba(155, 104, 71, 0.38);
    font-style: italic;
    color: var(--muted);
  }

  td,
  th {
    border-bottom: 1px solid var(--color-divider);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid var(--card-border);
  }

  pre,
  code {
    font-family: var(--font-mono);
    background-color: var(--color-code-block);
  }

  pre {
    max-width: 100%;
    box-sizing: border-box;
    margin: ${({ rhythm }) => rhythm(1.2)} 0;
    padding: 1rem 1.05rem;
    border: 1px solid var(--color-divider);
    border-radius: 6px;
    overflow-x: auto;
  }

  pre.grvsc-container {
    margin: ${({ rhythm }) => rhythm(1.2)} 0;
  }

  .grvsc-line-highlighted::before {
    background-color: var(--color-code-highlight) !important;
    box-shadow: inset 4px 0 0 0 var(--color-code-highlight-border) !important;
  }

  *:not(pre) > code {
    background-color: var(--color-code);
    padding: 0.16rem 0.34rem;
    margin: 0;
    font-size: 85%;
    border-radius: 4px;
  }
`

export default Markdown
