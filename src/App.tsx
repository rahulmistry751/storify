import { useState, useEffect } from 'react'
import { Story } from './types'
import StoryTray from './components/StoryTray/StoryTray'
import StoryViewer from './components/StoryViewer/StoryViewer'

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch('/stories.json')
      .then((res) => res.json())
      .then((data: Story[]) => {
        setStories(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleStoryClick = (index: number) => {
    setActiveStoryIndex(index)
  }

  const handleClose = () => {
    setActiveStoryIndex(null)
  }

  const handleStoryView = (index: number) => {
    setViewedStories((prev) => new Set(prev).add(index))
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1>Storify</h1>
      </div>
      <StoryTray
        stories={stories}
        viewedStories={viewedStories}
        isLoading={isLoading}
        onStoryClick={handleStoryClick}
      />
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={handleClose}
          onStoryView={handleStoryView}
        />
      )}
    </div>
  )
}

export default App
