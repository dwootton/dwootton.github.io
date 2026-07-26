import React from "react"

export const EnvelopeIcon: React.FC<{
  size?: number
}> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect x="1.5" y="3" width="13" height="10" rx="1.6" stroke="currentColor" />
    <path d="M2.5 4.5L8 8.7L13.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ThemeGlyph: React.FC<{
  isDark: boolean
}> = ({ isDark }) =>
  isDark ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M12.9 12.7C8.7 12.7 5.3 9.3 5.3 5.1C5.3 4.3 5.4 3.5 5.7 2.8C3.1 3.7 1.3 6.1 1.3 8.9C1.3 12.5 4.2 15.4 7.8 15.4C10.6 15.4 13 13.6 13.9 11C13.6 11.2 13.3 11.4 12.9 12.7Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3.1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9 1.6V3.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M9 14.7V16.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M1.6 9H3.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M14.7 9H16.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M3.8 3.8L5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M13 13L14.2 14.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M13 5L14.2 3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M3.8 14.2L5 13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
