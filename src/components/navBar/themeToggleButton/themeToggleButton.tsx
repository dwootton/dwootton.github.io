import React, { useContext } from "react"
import styled from "styled-components"

import type { UseThemeReturnType } from "Hooks/useTheme"
import ThemeContext from "Stores/themeContext"
import { DARK } from "Constants/theme"
import ThemeIcon from "./themeIcon"

interface ThemeToggleButtonProps {
  themeToggler: UseThemeReturnType["themeToggler"]
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ themeToggler }) => {
  const theme = useContext(ThemeContext)
  const LABEL_TEXT = theme === DARK ? "Light theme" : "Dark theme"

  return (
    <Button
      onClick={themeToggler}
      aria-label={LABEL_TEXT}
      title={LABEL_TEXT}
    >
      <Icon version="1.1" x="0px" y="0px" viewBox="0 0 24 24" aria-hidden>
        <ThemeIcon theme={theme} />
      </Icon>
      <Text className="label">{LABEL_TEXT}</Text>
    </Button>
  )
}

const Icon = styled.svg`
  width: 1.1rem;
  height: 1.1rem;
  fill: var(--color-icon);
  flex: 0 0 auto;
`

const Text = styled.span`
  margin-left: 8px;
  color: var(--color-text-2);
  font-size: 0.95rem;
  @media (min-width: ${({ theme }) => theme.device.sm}) {
    display: none; /* desktop: icon-only in the top navbar */
  }
`

const Button = styled.button`
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: var(--color-text);
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 6px 8px;
  line-height: 1;
  font-weight: var(--font-weight-medium);

  &:hover {
    color: var(--accent);
    ${Icon} { fill: var(--accent); }
  }

  &:focus-visible {
    outline: 4px solid var(--color-outline);
    outline-offset: 1px;
  }

  /* Mobile menu list: allow label next to icon */
  @media (max-width: ${({ theme }) => theme.device.sm}) {
    width: 100%;
    justify-content: flex-start;
    padding: 8px 0;
  }
`

export default ThemeToggleButton
