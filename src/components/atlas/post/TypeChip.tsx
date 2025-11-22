import React from 'react'
import styled from 'styled-components'
import type { AtlasPostType } from './types'

interface Props { type: AtlasPostType }

const labels: Record<AtlasPostType, string> = {
  essay: 'Essay',
  field_note: 'Field Note',
  guidepost: 'Guidepost',
  project: 'Project',
  talk: 'Talk',
  podcast: 'Podcast',
  log: 'Log',
  fragment: 'Fragment',
  map: 'Map',
}

const icons: Record<AtlasPostType, string> = {
  essay: '¶',
  field_note: '✎',
  guidepost: '◆',
  project: '▣',
  talk: '◷',
  podcast: '►',
  log: '⌘',
  fragment: '∴',
  map: '🗺' as unknown as string,
}

const TypeChip: React.FC<Props> = ({ type }) => (
  <Chip aria-label={`Type: ${labels[type]}`}>
    <span className="icon" aria-hidden>{icons[type]}</span>
    <span className="label">{labels[type]}</span>
  </Chip>
)

const Chip = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; letter-spacing: .02em; text-transform: none;
  color: var(--color-text-3);
  border: 1px solid var(--color-divider);
  background: var(--color-card);
  border-radius: 999px; padding: 3px 8px;
  .icon { opacity: .9 }
`

export default TypeChip

