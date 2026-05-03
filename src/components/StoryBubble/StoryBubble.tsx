import { StoryBubbleProps } from '../../types'
import './StoryBubble.css'

function StoryBubble({ story, index, isViewed, onClick }: Readonly<StoryBubbleProps>) {
  const handleClick = () => {
    onClick(index)
  }

  return (
    <button className="story-bubble" onClick={handleClick} aria-label={`View ${story.username}'s story`}>
      <div className={`story-bubble__ring${isViewed ? ' story-bubble__ring--viewed' : ''}`}>
        <div className="story-bubble__inner">
          <img
            className="story-bubble__avatar"
            src={story.avatar}
            alt={story.username}
            draggable={false}
          />
        </div>
      </div>
      <span className="story-bubble__username">{story.username}</span>
    </button>
  )
}

export default StoryBubble
