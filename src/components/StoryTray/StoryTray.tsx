import { StoryTrayProps } from '../../types'
import StoryBubble from '../StoryBubble/StoryBubble'
import './StoryTray.css'

const SKELETON_COUNT = 6

function StoryTray({ stories, viewedStories, isLoading, onStoryClick }: Readonly<StoryTrayProps>) {
  if (isLoading) {
    return (
      <div className="story-tray">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`).map((skeletonKey) => (
          <div className="story-tray__skeleton" key={skeletonKey}>
            <div className="story-tray__skeleton-ring" />
            <div className="story-tray__skeleton-label" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="story-tray">
      {stories.map((story, index) => (
        <StoryBubble
          key={story.id}
          story={story}
          index={index}
          isViewed={viewedStories.has(index)}
          onClick={onStoryClick}
        />
      ))}
    </div>
  )
}

export default StoryTray
