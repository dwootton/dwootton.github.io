import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&display=swap");

  ${reset}

  :root {
    font-size: 100%;

    --site-max: 1320px;
    --site-shell-max: 1520px;
    --page-gutter: clamp(72px, 10.5vw, 176px);
    --shell-gutter: clamp(24px, 4.5vw, 76px);
    --site-content-width: min(calc(100% - var(--page-gutter) - var(--page-gutter)), var(--site-max));
    --site-shell-width: min(calc(100% - var(--shell-gutter) - var(--shell-gutter)), var(--site-shell-max));
    --width: 1320px;
    --post-width: 760px;
    --min-width: 320px;
    --nav-height: 76px;
    --footer-height: 54px;

    --grid-gap-sm: 10px;
    --grid-gap-lg: 24px;
    --grid-gap-xl: 36px;

    --padding-sm: 16px;
    --padding-lg: 24px;

    --border-radius-sm: 6px;
    --border-radius-base: 6px;
    --border-radius-lg: 18px;

    --sizing-xs: 4px;
    --sizing-sm: 8px;
    --sizing-base: 16px;
    --sizing-md: 24px;
    --sizing-lg: 40px;
    --sizing-xl: 64px;

    --text-xs: 0.6875rem;
    --text-sm: 0.75rem;
    --text-base: 1rem;
    --text-md: 1.125rem;
    --text-title: 1.25rem;
    --text-lg: 1.5rem;
    --text-xl: 3rem;

    --device-xs-max-width: 419px;
    --device-sm-max-width: 767px;
    --device-md-max-width: 1023px;
    --device-lg-max-width: 1441px;

    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semi-bold: 600;
    --font-weight-bold: 700;
    --font-weight-extra-bold: 800;

    --bg: #fbfaf5;
    --bg-soft: #f7f3ea;
    --surface: #fffdf8;
    --surface-muted: #f5f1e8;
    --ink: #171717;
    --ink-soft: #383733;
    --muted: #79746a;
    --faint: #cfc8bb;
    --fainter: #e7e1d7;
    --green: #55766d;
    --green-dark: #38584f;
    --copper: #9b6847;
    --copper-soft: #b9977c;
    --survey-marker: #f4c542;
    --survey-marker-stroke: rgba(70, 50, 10, 0.35);
    --card-border: rgba(58, 50, 39, 0.16);
    --rule: rgba(58, 50, 39, 0.14);
    --shadow: rgba(50, 42, 32, 0.08);
    --card-paper: #fbf7ec;
    --card-paper-warm: #f3ecdd;
    --card-edge: rgba(96, 78, 52, 0.38);
    --card-edge-soft: rgba(96, 78, 52, 0.22);
    --card-ink: #171713;
    --card-body: rgba(32, 30, 25, 0.78);
    --card-muted: #746f65;
    --card-label: rgba(82, 75, 63, 0.72);
    --card-faint: rgba(96, 75, 52, 0.1);
    --card-glow: rgba(255, 255, 255, 0.86);
    --card-stain: rgba(95, 72, 42, 0.055);
    --card-stain-mark: rgba(116, 91, 55, 0.45);
    --card-speckle: rgba(96, 75, 52, 0.5);
    --card-edge-glaze: rgba(96, 78, 52, 0.075);
    --card-edge-glaze-strong: rgba(96, 78, 52, 0.11);
    --card-texture-blend: multiply;
    --card-tag-divider: rgba(96, 75, 52, 0.24);
    --card-copper: #8f5f3b;
    --card-green: #52786d;
    --card-blue: #6f8d98;
    --card-slate: #6d7371;
    --card-shadow: rgba(48, 39, 28, 0.16);
    --thumbnail-glow: rgba(255, 255, 255, 0.5);
    --thumbnail-frame-bg: rgba(247, 242, 231, 0.62);
    --thumbnail-frame-border: rgba(107, 90, 62, 0.24);
    --thumbnail-frame-highlight: rgba(255, 255, 255, 0.34);
    --thumbnail-frame-shadow: rgba(70, 50, 25, 0.08);
    --thumbnail-frame-soft-shadow: rgba(70, 50, 25, 0.035);
    --sketch-thumb-bg: #f3efe4;
    --sketch-thumb-panel: rgba(255, 250, 240, 0.72);
    --sketch-thumb-side-panel: rgba(255, 250, 240, 0.58);
    --sketch-thumb-stroke: rgba(95, 78, 55, 0.32);
    --sketch-thumb-rule: rgba(60, 73, 64, 0.3);
    --sketch-thumb-muted: #756e62;
    --sketch-thumb-text: #36342e;
    --sketch-thumb-node: #dbe7da;
    --sketch-thumb-dark-bg: #101c1f;
    --sketch-thumb-dark-panel: rgba(8, 15, 17, 0.62);
    --sketch-thumb-dark-side-panel: rgba(20, 35, 39, 0.72);
    --sketch-thumb-dark-stroke: rgba(216, 194, 156, 0.18);
    --sketch-thumb-dark-rule: rgba(216, 194, 156, 0.12);
    --sketch-thumb-dark-muted: rgba(232, 222, 207, 0.68);
    --sketch-thumb-dark-text: #e8decf;
    --sketch-thumb-dark-node: rgba(232, 222, 207, 0.12);
    --sketch-thumb-dark-green: rgba(143, 181, 173, 0.76);
    --sketch-thumb-dark-blue: rgba(111, 141, 155, 0.72);

    --font-sans: "Inter", "Avenir Next", "Helvetica Neue", Arial, sans-serif;
    --font-serif: "Newsreader", "Cormorant Garamond", "Iowan Old Style", Georgia, serif;
    --font-mono: "IBM Plex Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  }

  @media (max-width: 767px) {
    :root {
      --page-gutter: 22px;
      --shell-gutter: 16px;
    }
  }

  body.light {
    --surface: #fffdf8;
    --surface-muted: #f5f1e8;
    --faint: #cfc8bb;
    --fainter: #e7e1d7;
    --green: #55766d;
    --copper: #9b6847;
    --copper-soft: #b9977c;
    --card-border: rgba(58, 50, 39, 0.16);
    --rule: rgba(58, 50, 39, 0.14);
    --shadow: rgba(50, 42, 32, 0.08);
    --color-text: var(--ink);
    --color-text-2: var(--ink-soft);
    --color-text-3: var(--muted);
    --color-white: var(--surface);
    --color-nav-bar: rgba(251, 250, 245, 0.88);
    --color-nav-border: var(--rule);
    --color-category-button: var(--surface-muted);
    --color-background: var(--bg);
    --color-post-background: var(--bg);
    --color-card: rgba(255, 253, 248, 0.82);
    --color-code: #f4efe6;
    --color-code-block: #f5f0e6;
    --color-code-highlight: rgba(155, 104, 71, 0.08);
    --color-code-highlight-border: rgba(155, 104, 71, 0.22);
    --color-gray-1: var(--bg);
    --color-gray-2: #e5ddd1;
    --color-gray-3: #d7cebf;
    --color-gray-4: #aba294;
    --color-gray-5: #928a7d;
    --color-gray-6: var(--muted);
    --color-divider: var(--rule);
    --color-dimmed: rgba(58, 50, 39, 0.06);
    --color-floating-button: rgba(255, 253, 248, 0.88);
    --color-floating-button-hover: rgba(245, 241, 232, 0.96);
    --color-floating-button-border: var(--rule);
    --color-floating-button-border-hover: rgba(58, 50, 39, 0.2);
    --color-floating-button-text: var(--ink);
    --color-floating-button-text-hover: var(--ink);
    --color-floating-button-shadow: rgba(50, 42, 32, 0.08);
    --color-floating-button-shadow-hover: rgba(50, 42, 32, 0.12);
    --color-blue: var(--copper);
    --color-icon: var(--muted);
    --accent: var(--copper);
    --atlas-dot: rgba(23, 23, 23, 0.82);
    --atlas-grid: rgba(58, 50, 39, 0.11);
    --atlas-visited: rgba(85, 118, 109, 0.9);
    --card-hover-bg: rgba(255, 252, 245, 0.98);
    --card-hover-shadow:
      0 1px 2px rgba(50, 42, 32, 0.04),
      0 10px 28px rgba(50, 42, 32, 0.08);
    --color-outline: rgba(155, 104, 71, 0.38);
    --page-background:
      radial-gradient(circle at 45% 20%, rgba(255, 255, 255, 0.85), rgba(251, 250, 245, 0) 45%),
      linear-gradient(var(--color-post-background), var(--color-post-background));
    --page-background-size: auto, auto;
    --decor-guide: rgba(58, 50, 39, 0.07);
    --decor-guide-strong: rgba(58, 50, 39, 0.12);
    --degree-ruler-text: rgba(121, 116, 106, 0.42);
    --degree-ruler-hot: rgba(155, 104, 71, 0.66);
    --degree-ruler-line: rgba(58, 50, 39, 0.12);
    --hero-map-opacity: 0.48;
    --hero-map-mobile-opacity: 0.3;
    --route-stroke: rgba(155, 104, 71, 0.45);
    --route-node: rgba(155, 104, 71, 0.48);
    --atlas-ribbon-bg: rgba(255, 253, 248, 0.86);
    --atlas-ribbon-text: #7f563c;
    --atlas-ribbon-hover: var(--color-text);
    --atlas-ribbon-stroke: rgba(127, 86, 60, 0.42);
    --atlas-ribbon-rule: rgba(127, 86, 60, 0.22);
    --atlas-ribbon-dot: rgba(155, 104, 71, 0.72);
    --thumb-bg: #f7f3ea;
    --thumb-panel: rgba(255, 250, 240, 0.84);
    --thumb-side-panel: rgba(255, 250, 240, 0.68);
    --thumb-stroke: rgba(58, 50, 39, 0.22);
    --thumb-rule: rgba(58, 50, 39, 0.12);
    --thumb-accent: rgba(155, 104, 71, 0.48);
    --thumb-secondary: rgba(85, 118, 109, 0.58);
    --thumb-node: #e7eee7;
    --thumb-node-a: #e6ece1;
    --thumb-node-b: #dcebe4;
    --thumb-node-c: #f1e9d5;
    --thumb-node-d: #ebf0e7;
    --thumb-node-e: #e7e4db;
    --thumb-text: #5f5a50;
    --thumb-muted: #79746a;
    --thumb-dark-bg: #16221f;
    --thumb-dark-panel: rgba(8, 12, 13, 0.28);
    --thumb-dark-side-panel: rgba(255, 255, 255, 0.035);
    --thumb-dark-stroke: rgba(232, 222, 207, 0.13);
    --thumb-dark-rule: rgba(232, 222, 207, 0.08);
    --thumb-dark-accent: rgba(185, 151, 124, 0.68);
    --thumb-dark-secondary: rgba(122, 152, 141, 0.72);
    --thumb-dark-node: rgba(232, 222, 207, 0.1);
    --thumb-dark-text: #d8cfbf;
    --thumb-dark-muted: #d8cfbf;
  }

  body.dark {
    --surface: #0c171b;
    --surface-muted: #111f24;
    --faint: rgba(205, 146, 84, 0.34);
    --fainter: rgba(206, 169, 116, 0.2);
    --green: #8fb5ad;
    --green-dark: #6d978d;
    --copper: #cf8f52;
    --copper-soft: #d5ad7b;
    --survey-marker: #ffd84d;
    --survey-marker-stroke: rgba(255, 232, 128, 0.42);
    --card-border: rgba(207, 143, 82, 0.3);
    --rule: rgba(207, 143, 82, 0.22);
    --shadow: rgba(0, 0, 0, 0.42);
    --card-paper: #08181d;
    --card-paper-warm: #0d2025;
    --card-edge: rgba(207, 143, 82, 0.36);
    --card-edge-soft: rgba(207, 143, 82, 0.2);
    --card-ink: #eee2c9;
    --card-body: rgba(238, 226, 201, 0.8);
    --card-muted: rgba(216, 194, 156, 0.72);
    --card-label: rgba(216, 194, 156, 0.72);
    --card-faint: rgba(207, 143, 82, 0.14);
    --card-glow: rgba(37, 67, 70, 0.34);
    --card-stain: rgba(207, 143, 82, 0.055);
    --card-stain-mark: rgba(207, 143, 82, 0.22);
    --card-speckle: rgba(216, 194, 156, 0.5);
    --card-edge-glaze: rgba(207, 143, 82, 0.06);
    --card-edge-glaze-strong: rgba(207, 143, 82, 0.1);
    --card-texture-blend: screen;
    --card-tag-divider: rgba(216, 194, 156, 0.28);
    --card-copper: #cf8f52;
    --card-green: #8fb5ad;
    --card-blue: #7fa2b2;
    --card-slate: #9ca7a4;
    --thumbnail-glow: rgba(39, 71, 74, 0.38);
    --thumbnail-frame-bg: rgba(10, 27, 32, 0.72);
    --thumbnail-frame-border: rgba(207, 143, 82, 0.18);
    --thumbnail-frame-highlight: rgba(238, 226, 201, 0.04);
    --thumbnail-frame-shadow: rgba(0, 0, 0, 0.16);
    --thumbnail-frame-soft-shadow: rgba(0, 0, 0, 0.18);
    --sketch-thumb-bg: #07161a;
    --sketch-thumb-panel: rgba(11, 28, 33, 0.78);
    --sketch-thumb-side-panel: rgba(14, 34, 39, 0.66);
    --sketch-thumb-stroke: rgba(207, 143, 82, 0.24);
    --sketch-thumb-rule: rgba(207, 143, 82, 0.12);
    --sketch-thumb-muted: rgba(216, 194, 156, 0.68);
    --sketch-thumb-text: #e8decf;
    --sketch-thumb-node: rgba(238, 226, 201, 0.1);
    --sketch-thumb-dark-bg: #061419;
    --sketch-thumb-dark-panel: rgba(6, 14, 17, 0.68);
    --sketch-thumb-dark-side-panel: rgba(13, 28, 33, 0.74);
    --sketch-thumb-dark-stroke: rgba(207, 143, 82, 0.3);
    --sketch-thumb-dark-rule: rgba(207, 143, 82, 0.16);
    --sketch-thumb-dark-muted: rgba(216, 194, 156, 0.82);
    --sketch-thumb-dark-text: #eadfc8;
    --sketch-thumb-dark-node: rgba(238, 226, 201, 0.11);
    --sketch-thumb-dark-green: rgba(143, 181, 173, 0.78);
    --sketch-thumb-dark-blue: rgba(127, 162, 178, 0.76);
    --color-text: #eee2c9;
    --color-text-2: #91b8b6;
    --color-text-3: rgba(206, 169, 116, 0.74);
    --color-white: #eadfc8;
    --color-nav-bar: rgba(4, 12, 16, 0.9);
    --color-nav-border: rgba(207, 143, 82, 0.22);
    --color-category-button: #152326;
    --color-background: #041014;
    --color-post-background: #041014;
    --color-card: rgba(8, 20, 24, 0.82);
    --color-code: #132226;
    --color-code-block: #0f1c20;
    --color-code-highlight: rgba(197, 143, 91, 0.1);
    --color-code-highlight-border: rgba(197, 143, 91, 0.24);
    --color-gray-1: #071014;
    --color-gray-2: #122126;
    --color-gray-3: #1b2e33;
    --color-gray-4: #4b6868;
    --color-gray-5: #809999;
    --color-gray-6: rgba(206, 169, 116, 0.68);
    --color-divider: rgba(198, 142, 83, 0.2);
    --color-dimmed: rgba(234, 223, 200, 0.035);
    --color-floating-button: rgba(13, 26, 30, 0.88);
    --color-floating-button-hover: rgba(20, 37, 42, 0.98);
    --color-floating-button-border: rgba(198, 142, 83, 0.22);
    --color-floating-button-border-hover: rgba(198, 142, 83, 0.36);
    --color-floating-button-text: #eadfc8;
    --color-floating-button-text-hover: #eadfc8;
    --color-floating-button-shadow: rgba(0, 0, 0, 0.45);
    --color-floating-button-shadow-hover: rgba(0, 0, 0, 0.6);
    --color-blue: #cf8f52;
    --color-icon: rgba(213, 173, 123, 0.8);
    --accent: #cf8f52;
    --atlas-dot: rgba(234, 223, 200, 0.9);
    --atlas-grid: rgba(207, 143, 82, 0.16);
    --atlas-visited: rgba(143, 181, 173, 0.95);
    --card-hover-bg: rgba(17, 31, 36, 0.96);
    --card-hover-shadow:
      0 1px 2px rgba(0, 0, 0, 0.24),
      0 12px 34px rgba(0, 0, 0, 0.42);
    --color-outline: rgba(197, 143, 91, 0.42);
    --page-background:
      radial-gradient(circle at 34% 8%, rgba(35, 62, 65, 0.38), rgba(4, 16, 20, 0) 31%),
      radial-gradient(circle at 78% 24%, rgba(111, 72, 41, 0.2), rgba(4, 16, 20, 0) 32%),
      linear-gradient(90deg, rgba(207, 143, 82, 0.05) 1px, transparent 1px),
      linear-gradient(0deg, rgba(207, 143, 82, 0.04) 1px, transparent 1px),
      repeating-radial-gradient(circle at 40% 30%, rgba(238, 226, 201, 0.028) 0 1px, transparent 1px 5px),
      linear-gradient(#041014, #030d11);
    --page-background-size: auto, auto, 96px 96px, 96px 96px, 7px 7px, auto;
    --decor-guide: rgba(207, 143, 82, 0.23);
    --decor-guide-strong: rgba(207, 143, 82, 0.34);
    --degree-ruler-text: rgba(206, 169, 116, 0.6);
    --degree-ruler-hot: rgba(220, 142, 68, 0.98);
    --degree-ruler-line: rgba(207, 143, 82, 0.32);
    --hero-map-opacity: 0.82;
    --hero-map-mobile-opacity: 0.46;
    --route-stroke: rgba(207, 143, 82, 0.72);
    --route-node: rgba(207, 143, 82, 0.82);
    --atlas-ribbon-bg: rgba(7, 20, 24, 0.94);
    --atlas-ribbon-text: #d8c29c;
    --atlas-ribbon-hover: #eadfc8;
    --atlas-ribbon-stroke: rgba(207, 143, 82, 0.64);
    --atlas-ribbon-rule: rgba(207, 143, 82, 0.46);
    --atlas-ribbon-dot: rgba(207, 143, 82, 0.94);
    --thumb-bg: #07171b;
    --thumb-panel: rgba(12, 28, 32, 0.76);
    --thumb-side-panel: rgba(15, 32, 36, 0.62);
    --thumb-stroke: rgba(207, 143, 82, 0.28);
    --thumb-rule: rgba(207, 143, 82, 0.15);
    --thumb-accent: rgba(207, 143, 82, 0.68);
    --thumb-secondary: rgba(126, 166, 158, 0.72);
    --thumb-node: rgba(238, 226, 201, 0.12);
    --thumb-node-a: rgba(143, 181, 173, 0.2);
    --thumb-node-b: rgba(143, 181, 173, 0.16);
    --thumb-node-c: rgba(207, 143, 82, 0.18);
    --thumb-node-d: rgba(238, 226, 201, 0.12);
    --thumb-node-e: rgba(238, 226, 201, 0.1);
    --thumb-text: #d8c29c;
    --thumb-muted: rgba(216, 194, 156, 0.82);
    --thumb-dark-bg: #061419;
    --thumb-dark-panel: rgba(6, 14, 17, 0.68);
    --thumb-dark-side-panel: rgba(13, 28, 33, 0.74);
    --thumb-dark-stroke: rgba(207, 143, 82, 0.3);
    --thumb-dark-rule: rgba(207, 143, 82, 0.16);
    --thumb-dark-accent: rgba(220, 160, 91, 0.78);
    --thumb-dark-secondary: rgba(143, 181, 173, 0.78);
    --thumb-dark-node: rgba(238, 226, 201, 0.11);
    --thumb-dark-text: #eadfc8;
    --thumb-dark-muted: rgba(216, 194, 156, 0.82);
  }

  html,
  body,
  #___gatsby,
  #gatsby-focus-wrapper {
    min-height: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    min-width: var(--min-width);
    font-family: var(--font-sans);
    color: var(--color-text);
    background-color: var(--color-post-background);
    background: var(--page-background);
    background-size: var(--page-background-size);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  @supports (view-transition-name: none) {
    ::view-transition-old(atlas-map),
    ::view-transition-new(atlas-map) {
      animation-duration: 760ms;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      mix-blend-mode: normal;
      overflow: clip;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 420ms;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-old(atlas-map),
    ::view-transition-new(atlas-map),
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 1ms;
    }
  }

  :lang(ko) {
    word-break: keep-all;
  }

  ul,
  ol,
  li,
  dl,
  dt,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hgroup,
  p,
  blockquote,
  figure,
  form,
  fieldset,
  input,
  legend,
  pre,
  abbr,
  button {
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--color-text);
    font-family: var(--font-serif);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 160ms ease, opacity 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 180ms ease;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  img,
  svg {
    display: block;
    max-width: 100%;
  }

  ::selection {
    background: rgba(155, 104, 71, 0.14);
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  :focus-visible {
    outline: 3px solid var(--color-outline);
    outline-offset: 2px;
  }

  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
  }
`

export default GlobalStyle
