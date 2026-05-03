# Storify

An Instagram-style stories viewer built with React, TypeScript, and Vite.

## Features

- Horizontally scrollable story tray with user avatars
- Full-screen story viewer with auto-advance and timed progress bar
- Viewed/unviewed state tracking per story
- Stories loaded from a static JSON file

## Project Structure

```
src/
├── components/
│   ├── ProgressBar/     # Timed progress indicator for each story slide
│   ├── StoryBubble/     # Individual avatar bubble in the tray
│   ├── StoryTray/       # Horizontal list of story bubbles
│   └── StoryViewer/     # Full-screen overlay with image slideshow
├── types/               # Shared TypeScript interfaces
└── App.tsx              # Root component — fetches stories, manages state
public/
└── stories.json         # Story data (id, username, avatar, images[])
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |

## Data Format

Stories are served from `public/stories.json`. Each story object has:

```json
{
  "id": 1,
  "username": "string",
  "avatar": "image_url",
  "images": ["slide_url_1", "slide_url_2"]
}
```

## Tech Stack

- React 18
- TypeScript 5
- Vite 4
