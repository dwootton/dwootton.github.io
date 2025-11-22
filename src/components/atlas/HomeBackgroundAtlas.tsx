import React from 'react'
import styled from 'styled-components'
import AtlasMap from 'Components/atlas/AtlasMap'
import type { AtlasItem } from 'Components/atlas/types'

const HomeBackgroundAtlas: React.FC<{ items: AtlasItem[]; focus?: number }> = ({ items, focus = 0.7 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [offsetY, setOffsetY] = React.useState(0)
  React.useEffect(() => {
    const update = () => {
      const h = ref.current?.clientHeight || 0
      setOffsetY((focus - 0.5) * h)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [focus])
  return (
    <Wrap aria-hidden ref={ref}>
      <AtlasMap data={items} onSelect={() => {}} onHover={() => {}} drawOffsetY={offsetY} />
    </Wrap>
  )
}

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
`

export default HomeBackgroundAtlas
