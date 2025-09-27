import React from 'react'
import styled from 'styled-components'
import type { StatusStage } from './types'

const labels: Record<StatusStage, string> = {
  uncharted: 'Uncharted',
  in_progress: 'In Progress',
  charted: 'Charted',
  archived: 'Archived',
}

interface Props { status?: StatusStage }

const StatusChip: React.FC<Props> = ({ status = 'uncharted' }) => (
  <Chip aria-label={`Status: ${labels[status]}`}>
    <span className="dot" aria-hidden />
    {labels[status]}
  </Chip>
)

const Chip = styled.span`
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px;
  color: var(--color-text-3);
  border: 1px solid var(--color-divider);
  background: var(--color-card);
  border-radius: 999px; padding: 3px 8px;
  .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--accent); display: inline-block }
`

export default StatusChip

