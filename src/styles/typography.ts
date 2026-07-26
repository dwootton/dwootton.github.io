import Typography from "typography"

const typography = new Typography({
  bodyFontFamily: [
    "Inter",
    "Avenir Next",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  headerFontFamily: [
    "Newsreader",
    "Cormorant Garamond",
    "Iowan Old Style",
    "Georgia",
    "serif",
  ],
  baseFontSize: "18px",
  baseLineHeight: 1.7,
  scaleRatio: 2.2,
  includeNormalize: false,
  overrideStyles: () => ({
    a: {
      textDecoration: "none",
      color: "inherit",
    },
    body: {
      backgroundColor: "transparent",
    },
  }),
})

export const rhythm = typography.rhythm

export default typography
