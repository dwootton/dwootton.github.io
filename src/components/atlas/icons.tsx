import React from 'react'
import type { AtlasItemType } from '../atlas/types'

type Props = { size?: number; color?: string }

const CircleIcon: React.FC<Props> = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.25" fill="none" />
  </svg>
)

export const iconForType = (_type: AtlasItemType) => CircleIcon

