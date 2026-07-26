import React from 'react'

import CurrentHeadingMarker from 'Components/portfolio/CurrentHeadingMarker'

interface Props {
  forRef: React.RefObject<HTMLElement>
}

const HeadingIndicator: React.FC<Props> = ({ forRef }) => (
  <CurrentHeadingMarker
    containerRef={forRef}
    headingSelector="h2, h3"
    markerSize={10}
    offsetX={18}
  />
)

export default HeadingIndicator
