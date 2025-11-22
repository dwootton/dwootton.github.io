import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface SmartGifProps {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  className?: string
}

const SmartGif: React.FC<SmartGifProps> = ({ 
  src, 
  alt = '', 
  width = '100%', 
  height = 'auto',
  className 
}) => {
  const [gifSrc, setGifSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            setIsInView(true)
            setHasPlayed(true)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px', // Start loading slightly before it comes into view
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [hasPlayed])

  // Load GIF when in view
  useEffect(() => {
    if (isInView && src) {
      // Add timestamp to force reload
      const timestamp = new Date().getTime()
      setGifSrc(`${src}?t=${timestamp}`)
    }
  }, [isInView, src])

  // Handle click to replay
  const handleReplay = () => {
    setIsLoading(true)
    const timestamp = new Date().getTime()
    setGifSrc(`${src}?t=${timestamp}`)
  }

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <Container 
      ref={containerRef}
      className={className}
      onClick={handleReplay}
      $width={width}
      $height={height}
      title="Click to replay"
    >
      {isLoading && gifSrc && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {!isInView ? (
        <Placeholder>
          <PlayIcon>▶</PlayIcon>
          <PlaceholderText>GIF will play when scrolled into view</PlaceholderText>
        </Placeholder>
      ) : (
        <StyledImage
          ref={imgRef}
          src={gifSrc}
          alt={alt}
          onLoad={handleLoad}
          $isLoading={isLoading}
        />
      )}
      
      {hasPlayed && !isLoading && (
        <ReplayHint>
          <ReplayIcon>↻</ReplayIcon>
        </ReplayHint>
      )}
    </Container>
  )
}

const Container = styled.div<{ $width: string | number; $height: string | number }>`
  position: relative;
  width: ${props => typeof props.$width === 'number' ? `${props.$width}px` : props.$width};
  height: ${props => typeof props.$height === 'number' ? `${props.$height}px` : props.$height};
  min-height: 200px;
  background: ${({ theme }) => theme.colors?.background || '#f5f5f5'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`

const StyledImage = styled.img<{ $isLoading: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${props => props.$isLoading ? 0 : 1};
  transition: opacity 0.3s ease;
`

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

const PlayIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.9;
`

const PlaceholderText = styled.p`
  font-size: 14px;
  opacity: 0.8;
  text-align: center;
  padding: 0 20px;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ReplayHint = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  ${Container}:hover & {
    opacity: 1;
  }
`

const ReplayIcon = styled.span`
  font-size: 18px;
`

export default SmartGif