import React from "react"

const Logo = () => {
  return (
    <svg
      width="40"
      height="35"
      viewBox="0 0 40 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M0 34H40" stroke="currentColor" strokeOpacity="0.5" />
      <rect x="3" y="1" width="7" height="33" fill="currentColor" />
      <rect x="10.5" y="28" width="6" height="6" fill="currentColor" />
      <rect
        width="7"
        height="33"
        transform="matrix(-1 0 0 1 37 1)"
        fill="currentColor"
      />
      <rect
        width="6"
        height="6"
        transform="matrix(-1 0 0 1 29.5 28)"
        fill="currentColor"
      />
      <rect
        width="6"
        height="20"
        transform="matrix(-1 0 0 1 23 14)"
        fill="currentColor"
      />
    </svg>
  )
}

export default Logo
