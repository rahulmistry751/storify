import { useState, useEffect, useRef, useCallback } from 'react'
import { StoryViewerProps } from '../../types'
import ProgressBar from '../ProgressBar/ProgressBar'
import './StoryViewer.css'

const STORY_DURATION_MS = 5000

function StoryViewer({ stories, initialIndex, onClose, onStoryView }: Readonly<StoryViewerProps>) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(initialIndex)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [elapsed, setElapsed] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [slideDir, setSlideDir] = useState<'left' | 'right' | 'none'>('none')

  const animationFrameId = useRef<number | null>(null)
  const progressStartTime = useRef<number | null>(null)
  const accumulatedTime = useRef<number>(0)

  // Mutable ref to avoid stale closures in RAF callback
  const currentStoryIndexRef = useRef<number>(currentStoryIndex)
  const currentImageIndexRef = useRef<number>(currentImageIndex)
  useEffect(() => { currentStoryIndexRef.current = currentStoryIndex }, [currentStoryIndex])
  useEffect(() => { currentImageIndexRef.current = currentImageIndex }, [currentImageIndex])

  const currentStory = stories[currentStoryIndex]

  const cancelRAF = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  const resetProgress = useCallback(() => {
    cancelRAF()
    progressStartTime.current = null
    accumulatedTime.current = 0
    setElapsed(0)
  }, [cancelRAF])

  // goToNext / goToPrev defined via refs so the RAF tick can call them without stale closure
  const goToNextRef = useRef<() => void>(() => undefined)
  const goToPrevRef = useRef<() => void>(() => undefined)

  const goToNext = useCallback(() => {
    const storyIdx = currentStoryIndexRef.current
    const imageIdx = currentImageIndexRef.current
    const story = stories[storyIdx]

    if (imageIdx < story.images.length - 1) {
      resetProgress()
      setIsLoading(true)
      setCurrentImageIndex(imageIdx + 1)
    } else if (storyIdx < stories.length - 1) {
      resetProgress()
      setSlideDir('left')
      setIsLoading(true)
      setCurrentImageIndex(0)
      setCurrentStoryIndex(storyIdx + 1)
      onStoryView(storyIdx + 1)
    } else {
      onClose()
    }
  }, [onClose, onStoryView, resetProgress, stories])

  const goToPrev = useCallback(() => {
    const storyIdx = currentStoryIndexRef.current
    const imageIdx = currentImageIndexRef.current

    if (imageIdx > 0) {
      resetProgress()
      setIsLoading(true)
      setCurrentImageIndex(imageIdx - 1)
    } else if (storyIdx > 0) {
      resetProgress()
      setSlideDir('right')
      setIsLoading(true)
      setCurrentImageIndex(0)
      setCurrentStoryIndex(storyIdx - 1)
    }
  }, [resetProgress])

  useEffect(() => { goToNextRef.current = goToNext }, [goToNext])
  useEffect(() => { goToPrevRef.current = goToPrev }, [goToPrev])

  const startRAF = useCallback(() => {
    const tick = (timestamp: number) => {
      progressStartTime.current ??= timestamp
      const delta = timestamp - progressStartTime.current
      const total = accumulatedTime.current + delta
      const progress = Math.min(total / STORY_DURATION_MS, 1)
      setElapsed(progress)

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(tick)
      } else {
        animationFrameId.current = null
        goToNextRef.current()
      }
    }
    animationFrameId.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (isLoading) {
      cancelRAF()
    } else {
      progressStartTime.current = null
      startRAF()
    }
    return cancelRAF
  }, [isLoading, currentStoryIndex, currentImageIndex, startRAF, cancelRAF])

  // Mark story viewed
  useEffect(() => {
    onStoryView(currentStoryIndex)
  }, [currentStoryIndex, onStoryView])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleTapPrev = useCallback(() => {
    goToPrevRef.current()
  }, [])

  const handleTapNext = useCallback(() => {
    goToNextRef.current()
  }, [])

  const handleClose = useCallback(() => {
    cancelRAF()
    onClose()
  }, [cancelRAF, onClose])

  const handleSlideAnimationEnd = useCallback(() => {
    setSlideDir('none')
  }, [])

  if (!currentStory) return null

  const imageKey = `${currentStoryIndex}-${currentImageIndex}`
  const slideClass = slideDir === 'none'
    ? 'story-viewer__slide'
    : `story-viewer__slide story-viewer__slide--enter-${slideDir}`

  return (
    <div className="story-viewer">
      <div key={currentStoryIndex} className={slideClass} onAnimationEnd={handleSlideAnimationEnd}>
        {/* Background image */}
        <div className="story-viewer__image-wrapper">
          <img
            key={imageKey}
            className="story-viewer__image story-viewer__image--fade-enter"
            src={currentStory.images[currentImageIndex]}
            alt=""
            draggable={false}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {isLoading && (
            <div className="story-viewer__spinner-overlay">
              <div className="story-viewer__spinner" />
            </div>
          )}
        </div>

        {/* Tap zones */}
        <div className="story-viewer__tap-zones">
          <button className="story-viewer__tap-prev" aria-label="Previous" onClick={handleTapPrev} />
          <div className="story-viewer__tap-center" />
          <button className="story-viewer__tap-next" aria-label="Next" onClick={handleTapNext} />
        </div>

        {/* Header */}
        <div className="story-viewer__header">
          <div className="story-viewer__progress-row">
            <ProgressBar
              count={currentStory.images.length}
              activeIndex={currentImageIndex}
              elapsed={elapsed}
            />
          </div>
          <div className="story-viewer__user-row">
            <div className="story-viewer__avatar-ring">
              <img
                className="story-viewer__avatar"
                src={currentStory.avatar}
                alt={currentStory.username}
              />
            </div>
            <span className="story-viewer__username">{currentStory.username}</span>
            <button className="story-viewer__close" onClick={handleClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryViewer
