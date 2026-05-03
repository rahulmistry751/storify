export interface Story {
  id: number
  username: string
  avatar: string
  images: string[]
}

export interface StoryTrayProps {
  stories: Story[]
  viewedStories: Set<number>
  isLoading: boolean
  onStoryClick: (index: number) => void
}

export interface StoryBubbleProps {
  story: Story
  index: number
  isViewed: boolean
  onClick: (index: number) => void
}

export interface StoryViewerProps {
  stories: Story[]
  initialIndex: number
  onClose: () => void
  onStoryView: (index: number) => void
}

export interface ProgressBarProps {
  count: number
  activeIndex: number
  elapsed: number
}
