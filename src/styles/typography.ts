import Typography from "typography"

const fontStack = [
  "Comic Sans MS",
  "Comic Sans",
  "Cabin",
  "Inter",
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Helvetica",
  "Arial",
  "Apple Color Emoji",
  "Segoe UI Emoji",
]

const typography = new Typography({
  bodyFontFamily: fontStack,
  headerFontFamily: fontStack,
})

export const rhythm = typography.rhythm

export default typography
